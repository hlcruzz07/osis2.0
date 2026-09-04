import { Asterisk, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

interface BaseComboboxFieldProps {
    id: string;
    label: string;
    error?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

interface ComboboxFieldObjectProps<T> extends BaseComboboxFieldProps {
    value: T[keyof T] | null | undefined;
    options: T[];
    valueKey: keyof T;
    labelKey: keyof T;
    onChange: (value: T[keyof T]) => void;
}

interface ComboboxFieldStringProps extends BaseComboboxFieldProps {
    value: string | null | undefined;
    options: string[];
    valueKey?: undefined;
    labelKey?: undefined;
    onChange: (value: string) => void;
}

type ComboboxFieldProps<T> =
    ComboboxFieldObjectProps<T> | ComboboxFieldStringProps;

export function ComboboxField<T>({
    id,
    label,
    value,
    options,
    error,
    placeholder = 'Choose an option',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No option found.',
    required = false,
    valueKey,
    labelKey,
    onChange,
    disabled,
    className,
}: ComboboxFieldProps<T>) {
    const [open, setOpen] = useState(false);

    const getValue = (option: T | string): string | T[keyof T] =>
        typeof option === 'string'
            ? option
            : (option as T)[valueKey as keyof T];

    const getLabel = (option: T | string): unknown =>
        typeof option === 'string'
            ? option
            : (option as T)[labelKey as keyof T];

    const hasValue =
        value !== null && value !== undefined && String(value).trim() !== '';

    const selectedOption = hasValue
        ? options.find((option) => getValue(option) === value)
        : undefined;

    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label}

                {required && <Asterisk size={15} color="red" />}
            </FieldLabel>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        aria-expanded={open}
                        aria-invalid={!!error}
                        className={cn(
                            'w-full justify-between',
                            !selectedOption && 'text-muted-foreground',
                            className,
                        )}
                    >
                        {selectedOption
                            ? String(getLabel(selectedOption))
                            : placeholder}

                        <ChevronsUpDown className="size-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="h-9"
                        />

                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>

                            <CommandGroup>
                                {options.map((option) => {
                                    const optionValue = getValue(option);
                                    const optionLabel = getLabel(option);

                                    return (
                                        <CommandItem
                                            key={String(optionValue)}
                                            value={String(optionLabel)}
                                            onSelect={() => {
                                                onChange(optionValue as never);

                                                setOpen(false);
                                            }}
                                        >
                                            {String(optionLabel)}

                                            <Check
                                                className={cn(
                                                    'ml-auto size-4',
                                                    value === optionValue
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
