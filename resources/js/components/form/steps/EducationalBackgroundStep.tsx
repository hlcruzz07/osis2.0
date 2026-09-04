import { XIcon } from 'lucide-react';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import { SelectField } from '@/components/form/SelectField';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import { capitalizeString } from '@/lib/utils';

import type {
    ResetStudentFormData,
    SetStudentFormData,
    StudentForm,
    StudentFormErrors,
} from '@/types/form';

interface EducationalBackgroundStepProps {
    data: StudentForm;
    setData: SetStudentFormData;
    reset?: ResetStudentFormData;
    errors: StudentFormErrors;
    schoolType: string[];
}

export function EducationalBackgroundStep({
    data,
    setData,
    errors,
    schoolType,
}: EducationalBackgroundStepProps) {
    return (
        <>
            <FormSection
                title="Senior High School (Optional)"
                description="Provide your Senior High School background. If you did not attend Senior High School or this information does not apply to you, you may leave this section blank."
            >
                <FormGrid>
                    <TextField
                        id="shs_name"
                        label="School Name"
                        value={data.shs_name ?? ''}
                        error={errors['shs_name']}
                        placeholder="Enter School Name"
                        onChange={(value) => setData('shs_name', value)}
                    />
                    <div className="flex items-end">
                        <SelectField
                            id="shs_type"
                            label="School Type"
                            value={data.shs_type ?? ''}
                            options={schoolType}
                            error={errors['shs_type']}
                            onChange={(value) => {
                                setData('shs_type', String(value));
                            }}
                            className={
                                data.shs_type ? 'rounded-e-none' : undefined
                            }
                        />
                        {data.shs_type && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="rounded-s-none"
                                onClick={() => setData('shs_type', '')}
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>

                    <TextField
                        id="shs_address"
                        label="School Address"
                        value={data.shs_address ?? ''}
                        error={errors['shs_address']}
                        maxLength={150}
                        placeholder="Enter School Address"
                        onChange={(value) =>
                            setData('shs_address', capitalizeString(value))
                        }
                    />

                    <TextField
                        id="shs_year"
                        label="Year Graduated"
                        value={data.shs_year ?? ''}
                        error={errors['shs_year']}
                        numeric
                        placeholder="e.g. 2022, 2018"
                        onChange={(value) =>
                            setData('shs_year', value.slice(0, 4))
                        }
                    />
                </FormGrid>
            </FormSection>

            <FormSection
                title="College (Optional)"
                description="Provide your previous college or university background, if applicable. If you have not attended college before, you may leave this section blank."
            >
                <FormGrid>
                    <TextField
                        id="c_name"
                        label="School Name"
                        value={data.c_name ?? ''}
                        error={errors['c_name']}
                        placeholder="Enter School Name"
                        onChange={(value) => setData('c_name', value)}
                    />

                    <div className="flex items-end">
                        <SelectField
                            id="c_type"
                            label="School Type"
                            value={data.c_type ?? ''}
                            options={schoolType}
                            error={errors['c_type']}
                            onChange={(value) => {
                                setData('c_type', String(value));
                            }}
                            className={
                                data.c_type ? 'rounded-e-none' : undefined
                            }
                        />
                        {data.c_type && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="rounded-s-none"
                                onClick={() => setData('c_type', '')}
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>

                    <TextField
                        id="c_address"
                        label="School Address"
                        value={data.c_address ?? ''}
                        error={errors['c_address']}
                        maxLength={150}
                        placeholder="Enter School Address"
                        onChange={(value) =>
                            setData('c_address', capitalizeString(value))
                        }
                    />

                    <TextField
                        id="c_year"
                        label="Year Graduated"
                        value={data.c_year ?? ''}
                        error={errors['c_year']}
                        numeric
                        placeholder="e.g. 2022, 2018"
                        onChange={(value) =>
                            setData('c_year', value.slice(0, 4))
                        }
                    />
                </FormGrid>
            </FormSection>
        </>
    );
}
