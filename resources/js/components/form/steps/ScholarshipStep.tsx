import { Asterisk } from 'lucide-react';
import { useState } from 'react';
import { FormSection } from '@/components/form/FormSection';
import { SelectField } from '@/components/form/SelectField';
import { TextField } from '@/components/form/TextField';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { StudentForm } from '@/types/form';

type ScholarshipStepProps = {
    data: StudentForm;
    setData: (key: any, value: any) => void;
    errors: Partial<Record<string, string>>;
    scholarshipProgram: string[];
};

const CHED_LABEL = 'CHED MERIT SCHOLARSHIP PROGRAM (CMSP)';
const OTHERS_LABEL = 'OTHERS';
const CHED_TYPES = ['Full', 'Half'];

export function ScholarshipStep({
    data,
    setData,
    errors,
    scholarshipProgram,
}: ScholarshipStepProps) {
    const scholarships = data.scholarships ?? [];

    const chedEntry = scholarships.find((item) => item.startsWith(CHED_LABEL));
    const chedType = chedEntry?.split(' - ')[1] ?? '';

    const othersEntry = scholarships.find((item) =>
        item.startsWith(OTHERS_LABEL),
    );
    const [othersText, setOthersText] = useState(
        othersEntry?.split(' - ').slice(1).join(' - ') ?? '',
    );

    const isChecked = (option: string) => {
        if (option === CHED_LABEL) {
            return scholarships.some((item) => item.startsWith(CHED_LABEL));
        }

        if (option === OTHERS_LABEL) {
            return scholarships.some((item) => item.startsWith(OTHERS_LABEL));
        }

        return scholarships.includes(option);
    };

    const removeByPrefix = (list: string[], prefix: string) =>
        list.filter((item) => !item.startsWith(prefix));

    const toggleOption = (option: string, checked: boolean) => {
        let updated = [...scholarships];

        if (option === CHED_LABEL) {
            updated = removeByPrefix(updated, CHED_LABEL);

            if (checked) {
                updated.push(
                    chedType ? `${CHED_LABEL} - ${chedType}` : CHED_LABEL,
                );
            }
        } else if (option === OTHERS_LABEL) {
            updated = removeByPrefix(updated, OTHERS_LABEL);

            if (checked) {
                updated.push(
                    othersText
                        ? `${OTHERS_LABEL} - ${othersText}`
                        : OTHERS_LABEL,
                );
            } else {
                setOthersText('');
            }
        } else {
            updated = updated.filter((item) => item !== option);

            if (checked) {
                updated.push(option);
            }
        }

        setData('scholarships', updated);
    };

    const handleChedTypeChange = (value: string) => {
        const updated = removeByPrefix(scholarships, CHED_LABEL);
        updated.push(`${CHED_LABEL} - ${value}`);
        setData('scholarships', updated);
    };

    const handleOthersTextChange = (value: string) => {
        setOthersText(value);

        if (isChecked(OTHERS_LABEL)) {
            const updated = removeByPrefix(scholarships, OTHERS_LABEL);
            updated.push(value ? `${OTHERS_LABEL} - ${value}` : OTHERS_LABEL);
            setData('scholarships', updated);
        }
    };

    return (
        <FormSection
            title="Scholarship Program"
            description="Indicate any scholarship program you are applying for, if applicable. You may select multiple."
        >
            <div className="space-y-3">
                {scholarshipProgram.map((option) => {
                    const checked = isChecked(option);

                    return (
                        <Field
                            key={option}
                            className="rounded-lg border p-4"
                            data-invalid={!!errors.scholarships}
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    id={`scholarship-${option}`}
                                    checked={checked}
                                    onCheckedChange={(value) =>
                                        toggleOption(option, !!value)
                                    }
                                />

                                <div className="flex-1 space-y-1">
                                    <FieldLabel
                                        htmlFor={`scholarship-${option}`}
                                        className="cursor-pointer font-medium"
                                    >
                                        {option}
                                    </FieldLabel>
                                </div>
                            </div>

                            {checked && option === CHED_LABEL && (
                                <div className="mt-4 space-y-4 pl-7">
                                    <Field>
                                        <FieldLabel htmlFor="ched_type">
                                            Scholarship Type
                                            <Asterisk size={15} color="red" />
                                        </FieldLabel>

                                        <SelectField
                                            id="ched_type"
                                            label=""
                                            value={chedType}
                                            options={CHED_TYPES}
                                            onChange={handleChedTypeChange}
                                            placeholder="Select type"
                                        />
                                    </Field>
                                </div>
                            )}

                            {checked && option === OTHERS_LABEL && (
                                <div className="mt-4 space-y-4 pl-7">
                                    <TextField
                                        id="others_scholarship"
                                        label="Please specify"
                                        value={othersText}
                                        uppercase
                                        onChange={handleOthersTextChange}
                                        placeholder="Enter specific scholarship details"
                                        required
                                    />
                                </div>
                            )}
                        </Field>
                    );
                })}

                {errors.scholarships && (
                    <FieldError>{errors.scholarships}</FieldError>
                )}
            </div>
        </FormSection>
    );
}
