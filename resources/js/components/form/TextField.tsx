import { Asterisk } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    onChange: (value: string) => void;
    uppercase?: boolean;
    required?: boolean;
    numeric?: boolean;
    maxLength?: number;
}

export function TextField({
    id,
    label,
    value,
    error,
    placeholder,
    type = 'text',
    onChange,
    uppercase = false,
    required = false,
    numeric = false,
    maxLength,
}: TextFieldProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label}

                {required && <Asterisk size={15} color="red" />}
            </FieldLabel>

            <Input
                id={id}
                type={type}
                inputMode={numeric ? 'numeric' : undefined}
                pattern={numeric ? '[0-9]*' : undefined}
                maxLength={maxLength}
                value={value}
                onChange={(e) => {
                    let value = e.target.value;

                    if (numeric) {
                        value = value.replace(/\D/g, '');
                    }

                    if (uppercase) {
                        value = value.toUpperCase();
                    }

                    onChange(value);
                }}
                aria-invalid={!!error}
                placeholder={placeholder}
            />

            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
