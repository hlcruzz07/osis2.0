import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const STEPS = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'academic', label: 'Academic Status & Preferences' },
    { id: 'education', label: 'Educational Background' },
    { id: 'family', label: 'Family Background' },
    { id: 'socioeconomic', label: 'Socioeconomic & Demographic Profile' },
    { id: 'scholarship', label: 'Scholarship Program' },
    { id: 'privacy', label: 'Privacy Statement' },
] as const;

export const LAST_STEP = STEPS.length - 1;

export function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <ol className="mb-8 flex w-full items-start">
            {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <li
                        key={step.id}
                        className="relative flex flex-1 flex-col items-center text-center"
                    >
                        {index !== 0 && (
                            <div
                                className={cn(
                                    'absolute top-4 right-1/2 h-[2px] w-full -translate-y-1/2',
                                    isCompleted || isCurrent
                                        ? 'bg-primary'
                                        : 'bg-border',
                                )}
                            />
                        )}

                        <span
                            className={cn(
                                'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
                                isCompleted &&
                                    'border-primary bg-primary text-primary-foreground',
                                isCurrent &&
                                    !isCompleted &&
                                    'border-primary bg-background text-primary',
                                !isCompleted &&
                                    !isCurrent &&
                                    'border-border bg-background text-muted-foreground',
                            )}
                        >
                            {isCompleted ? (
                                <CheckIcon className="size-4" />
                            ) : (
                                index + 1
                            )}
                        </span>

                        <span
                            className={cn(
                                'mt-2 hidden max-w-24 text-xs font-medium sm:block',
                                isCurrent
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {step.label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
