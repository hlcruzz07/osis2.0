// resources/js/components/student/SubmittingDialog.tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SubmittingDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    percentage?: number | null;
}

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SubmittingDialog({
    open,
    title = 'Submitting Form',
    description = 'Please wait while your information is being processed and securely saved. Kindly do not close or refresh this window.',
    percentage = null,
}: SubmittingDialogProps) {
    const hasProgress = percentage !== null && percentage !== undefined;
    const clamped = hasProgress
        ? Math.min(100, Math.max(0, percentage as number))
        : 0;
    const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

    return (
        <Dialog open={open}>
            <DialogContent
                className="overflow-hidden sm:max-w-sm [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                        <svg
                            className="h-20 w-20 -rotate-90"
                            viewBox="0 0 80 80"
                        >
                            {/* Track */}
                            <circle
                                cx="40"
                                cy="40"
                                r={RADIUS}
                                fill="none"
                                strokeWidth="6"
                                className="stroke-muted"
                            />

                            {/* Progress / indeterminate arc */}
                            <circle
                                cx="40"
                                cy="40"
                                r={RADIUS}
                                fill="none"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={
                                    hasProgress ? offset : CIRCUMFERENCE * 0.72
                                }
                                className={
                                    hasProgress
                                        ? 'transition-[stroke-dashoffset] duration-500 ease-out'
                                        : 'animate-spin'
                                }
                                style={{
                                    stroke: 'oklch(0.636 0.108 172.521)',
                                    transformOrigin: '40px 40px',
                                }}
                            />
                        </svg>

                        <span className="absolute text-sm font-semibold text-foreground tabular-nums">
                            {hasProgress ? `${Math.round(clamped)}%` : ''}
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-base font-semibold tracking-tight">
                            {title}
                        </p>
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
