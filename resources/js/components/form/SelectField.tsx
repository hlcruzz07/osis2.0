import { Asterisk } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    options: string[];
    error?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export function SelectField({
    id,
    label,
    value,
    options,
    error,
    placeholder = 'Choose an option',
    onChange,
    disabled = false,
    required = false,
    className,
}: SelectFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label} {required && <Asterisk size={15} color="red" />}
            </FieldLabel>

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    id={id}
                    aria-invalid={!!error}
                    disabled={options.length === 0 || disabled}
                    className={className}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent align="center" position="item-aligned">
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
