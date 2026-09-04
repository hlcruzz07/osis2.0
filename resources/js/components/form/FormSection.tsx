import type { ReactNode } from 'react';
import { FieldDescription, FieldGroup, FieldSet } from '@/components/ui/field';

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export function FormSection({
    title,
    description,
    children,
}: FormSectionProps) {
    return (
        <FieldSet>
            <div>
                <h3 className="text-xl font-bold">{title}</h3>

                {description && (
                    <FieldDescription>{description}</FieldDescription>
                )}
            </div>

            <FieldGroup>{children}</FieldGroup>
        </FieldSet>
    );
}
