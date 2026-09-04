import { AlertCircleIcon } from 'lucide-react';
import { FormSection } from '@/components/form/FormSection';

export function EmptyStepPlaceholder({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <FormSection title={title} description={description}>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
                <AlertCircleIcon className="size-6" />
                <p className="text-sm font-medium">
                    This section hasn&apos;t been built yet.
                </p>
                <p className="text-xs">
                    Fields for &quot;{title}&quot; will appear here.
                </p>
            </div>
        </FormSection>
    );
}
