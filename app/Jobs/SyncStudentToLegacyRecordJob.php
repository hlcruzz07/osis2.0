<?php

namespace App\Jobs;

use App\Models\Student;
use App\Services\StudentStoreRecordService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SyncStudentToLegacyRecordJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * This job is only ever dispatched as a fallback, after an immediate
     * synchronous sync attempt already failed once in the request. So we
     * retry fast at first (transient blip, brief network hiccup) and back
     * off further for sustained outages, rather than starting slow.
     */
    public int $tries = 5;

    public array $backoff = [10, 30, 60, 300, 900];

    /**
     * How long a single attempt is allowed to run before Laravel considers
     * it timed out and releases it back for retry. Keep this well above the
     * PDO connect timeout (see config/database.php) but not so high that a
     * truly hung attempt blocks the queue worker for ages.
     */
    public int $timeout = 30;

    public function __construct(protected int $studentId)
    {
    }

    /**
     * Route to a dedicated queue so this isn't stuck behind bulkier jobs
     * (e.g. UploadFileToGoogleDriveJob) during peak enrollment traffic.
     * Set here so ->onQueue() doesn't need to be remembered at every
     * dispatch call site.
     */
    public function viaQueue(): string
    {
        return 'legacy-sync';
    }

    /**
     * Prevents duplicate jobs for the same student piling up in the queue
     * — e.g. if the immediate sync attempt fails, dispatches this job, and
     * something else (a retry of the request, a manual resync) also
     * dispatches it before the first one has run.
     */
    public function uniqueId(): string
    {
        return (string) $this->studentId;
    }

    /**
     * How long the "unique" lock is held. Should comfortably outlast the
     * worst-case total retry window (tries + backoff) so a slow-to-fail
     * job doesn't let a duplicate slip in before it's done.
     */
    public function uniqueFor(): int
    {
        return 3600;
    }

    public function handle(StudentStoreRecordService $recordService): void
    {
        // Reload fresh from the primary DB with the relations
        // buildRecordPayload needs — don't rely on a serialized snapshot
        // from dispatch time, since this may run minutes/hours later after
        // retries.
        $student = Student::with(['address', 'socioEconomicProfile'])->find($this->studentId);

        if (!$student) {
            // Student record was deleted before the job ran — nothing to sync.
            $this->delete();

            return;
        }

        $synced = $recordService->sync($student);

        if (!$synced) {
            // No legacy connection mapped for this campus — not a transient
            // failure, don't retry.
            Log::warning('No legacy connection mapped for campus, skipping sync', [
                'student_id' => $this->studentId,
                'campus' => $student->campus,
            ]);
        }
    }

    /**
     * Called once all retries are exhausted.
     */
    public function failed(Throwable $exception): void
    {
        Log::error('Legacy record sync permanently failed after retries', [
            'student_id' => $this->studentId,
            'message' => $exception->getMessage(),
        ]);

        // Consider notifying the registrar/admin here so a permanently
        // failed sync doesn't just silently vanish into the failed_jobs
        // table — the hourly/15-min students:resync-legacy sweep will
        // still pick this student up later, but someone should probably
        // know sooner if a campus server has been down for 25+ minutes.
    }
}