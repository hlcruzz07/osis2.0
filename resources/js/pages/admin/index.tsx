import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ThemeButton from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';

export type FlashMessages = {
    success?: string | null;
    error?: string | null;
    info?: string | null;
    warning?: string | null;
};

// Update this to your actual Google OAuth redirect route
// e.g. if you're using Laravel Socialite: Route::get('/auth/google/redirect', ...)
const GOOGLE_AUTH_URL = '/auth/google/redirect';

// The campuses OSIS keeps in sync, so an admin can see the scope of what
// they're signing into rather than a generic "admin panel" claim.
const CAMPUSES = ['Talisay', 'Alijis', 'Fortune Towne', 'Binalbagan'];

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M23.49 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.25 21.3 7.31 24 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27v-3.1H1.27A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.1z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"
            />
        </svg>
    );
}

export default function Index() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const flash: FlashMessages = usePage().props.flash || {};

    useEffect(() => {
        if (!flash) {
            return;
        }

        const timeoutId = setTimeout(() => {
            if (flash.success) {
                toast.success(flash.success);
            }

            if (flash.error) {
                toast.error(flash.error);
            }

            if (flash.info) {
                toast.info(flash.info);
            }

            if (flash.warning) {
                toast.warning(flash.warning);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [flash]);

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <ThemeButton />

            <header className="flex items-center gap-2.5 px-6 pt-6 sm:justify-center sm:px-10 sm:pt-8">
                <img
                    src="/logo.webp"
                    className="w-7"
                    loading="lazy"
                    alt="CHMSU logo"
                />
                <span className="text-[13px] font-semibold tracking-tight text-foreground">
                    CHMSU
                </span>
                <span className="text-[13px] text-muted-foreground">/</span>
                <span className="text-[13px] tracking-tight text-muted-foreground">
                    OSIS Admin
                </span>
            </header>

            <main className="flex flex-1 items-center px-6 sm:px-10">
                <div className="mx-auto w-full max-w-[360px] py-16">
                    <h1 className="text-[26px] leading-[1.25] font-semibold tracking-tight text-foreground">
                        Sign in to the
                        <br />
                        admin console.
                    </h1>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
                        Review submissions, manage student records, and keep
                        OSIS data in sync across campuses.
                    </p>

                    <div className="mt-8">
                        <Button asChild className="h-11 w-full text-[14px]">
                            <a href={GOOGLE_AUTH_URL}>
                                <GoogleIcon />
                                Continue with Google
                            </a>
                        </Button>
                        <p className="mt-3 text-[12.5px] text-muted-foreground">
                            Restricted to authorized CHMSU staff accounts.
                        </p>
                    </div>

                    <div
                        className="mt-10 border-t pt-5"
                        style={{ borderColor: 'oklch(0.9 0.005 90)' }}
                    >
                        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                            Campuses covered
                        </span>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                            {CAMPUSES.map((campus) => (
                                <span
                                    key={campus}
                                    className="flex items-center gap-1.5 text-[12.5px] text-foreground/80"
                                >
                                    <span
                                        className="h-1 w-1 rounded-full"
                                        style={{
                                            backgroundColor:
                                                'oklch(0.55 0.1 172.5)',
                                        }}
                                    />
                                    {campus}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mx-auto block px-5 pb-4 sm:px-0">
                <p className="text-[12px] text-muted-foreground/70">
                    Need access or having trouble signing in? Contact the IT
                    support office.
                </p>
            </footer>
        </div>
    );
}
