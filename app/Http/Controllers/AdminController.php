<?php

namespace App\Http\Controllers;

use App\Enums\StudentEconomicStatus;
use App\Models\Student;
use App\Models\StudentSocioEconomicProfile;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/index');
    }

    /**
     * Show the admin dashboard with cached summary stats and recent activity.
     */
    public function dashboard()
    {
        $stats = [
            'total_students' => Student::count(),
            'new_this_week' => Student::where('created_at', '>=', now()->subWeek())->count(),
            'total_campuses' => Student::whereNotNull('campus_hash')->distinct('campus_hash')->count('campus_hash'),
        ];

        // Group by the hash twin since `campus` itself is encrypted per-row.
        $campusGroups = Student::select('campus_hash', DB::raw('count(*) as total'))
            ->whereNotNull('campus_hash')
            ->groupBy('campus_hash')
            ->orderByDesc('total')
            ->get();

        // Decrypt one representative row per hash group to get a display name.
        $campusBreakdown = $campusGroups->map(function ($group) {
            $sample = Student::where('campus_hash', $group->campus_hash)->first();

            return [
                'campus' => $sample?->campus,
                'total' => $group->total,
            ];
        })->values();

        $totalProfiles = StudentSocioEconomicProfile::count();
        $pendingProfiles = StudentSocioEconomicProfile::where(
            'status',
            '=',
            StudentEconomicStatus::PENDING->value
        )->count();

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'campusBreakdown' => $campusBreakdown,
            'socioEconomicReview' => [
                'total' => $totalProfiles,
                'pending' => $pendingProfiles,
            ],
        ]);
    }

    public function redirect()
    {

        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        try {

            $user = User::where('email_hash', hash('sha256', $googleUser->getEmail()))->first();

            if (! $user) {

                return redirect()->route('admin')->with('error', 'Invalid credentials');
            }

            $user->update([
                'name' => $googleUser->getName(),
                'name_hash' => hash('sha256', $googleUser->getName()),
                'avatar' => $googleUser->getAvatar(),
            ]);

            Auth::login($user);

            return redirect()->route('dashboard')->with('success', 'Welcome '.$user->name);

        } catch (Exception $e) {

            Log::error($e->getMessage());

            return redirect()->route('admin')->with('error', 'Something went wrong.');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $request->session()->flush();

        return redirect()->route('admin')->with('success', 'Logged out successfully');
    }
}
