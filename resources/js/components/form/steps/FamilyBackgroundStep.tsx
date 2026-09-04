import { XIcon } from 'lucide-react';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import { SelectField } from '@/components/form/SelectField';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import type { StudentForm } from '@/types/form';

type FamilyBackgroundStepProps = {
    data: StudentForm;
    setData: (key: any, value: any) => void;
    errors: Partial<Record<string, string>>;
    highestEduAttainment: string[];
};

type FamilyRole = 'f' | 'm' | 's';

const roleConfig: Record<FamilyRole, { title: string; description: string }> = {
    f: {
        title: "Father's Information",
        description: 'Optional. Provide your father/guardian details.',
    },
    m: {
        title: "Mother's Information",
        description: 'Optional. Provide your mother/guardian details.',
    },
    s: {
        title: "Spouse's Information",
        description: 'Optional. Provide your spouse details.',
    },
};

export function FamilyBackgroundStep({
    data,
    setData,
    errors,
    highestEduAttainment,
}: FamilyBackgroundStepProps) {
    const renderFields = (role: FamilyRole) => {
        const fnameKey = `${role}_fname` as keyof StudentForm;
        const mnameKey = `${role}_mname` as keyof StudentForm;
        const lnameKey = `${role}_lname` as keyof StudentForm;
        const occupationKey = `${role}_occupation` as keyof StudentForm;
        const eduKey = `${role}_highest_education` as keyof StudentForm;

        return (
            <FormSection
                title={roleConfig[role].title}
                description={roleConfig[role].description}
            >
                <FormGrid columns={3}>
                    <TextField
                        id={fnameKey}
                        label="First Name"
                        placeholder={`Enter ${role === 'f' ? 'Father' : role === 'm' ? 'Mother' : 'Spouse'} First Name`}
                        value={(data[fnameKey] as string) ?? ''}
                        error={errors[fnameKey]}
                        onChange={(value) => setData(fnameKey, value)}
                        uppercase
                    />

                    <TextField
                        id={mnameKey}
                        label="Middle Name"
                        value={(data[mnameKey] as string) ?? ''}
                        placeholder={`Enter ${role === 'f' ? 'Father' : role === 'm' ? 'Mother' : 'Spouse'} Middle Name`}
                        error={errors[mnameKey]}
                        maxLength={50}
                        onChange={(value) => setData(mnameKey, value)}
                        uppercase
                    />

                    <TextField
                        id={lnameKey}
                        label="Last Name"
                        value={(data[lnameKey] as string) ?? ''}
                        placeholder={`Enter ${role === 'f' ? 'Father' : role === 'm' ? 'Mother' : 'Spouse'} Last Name`}
                        error={errors[lnameKey]}
                        maxLength={50}
                        onChange={(value) => setData(lnameKey, value)}
                        uppercase
                    />
                </FormGrid>

                <FormGrid columns={2}>
                    <TextField
                        id={occupationKey}
                        label="Occupation"
                        value={(data[occupationKey] as string) ?? ''}
                        placeholder={`Enter ${role === 'f' ? 'Father' : role === 'm' ? 'Mother' : 'Spouse'} Occupation`}
                        error={errors[occupationKey]}
                        maxLength={50}
                        onChange={(value) => setData(occupationKey, value)}
                    />

                    <div className="flex items-end">
                        <SelectField
                            id={eduKey}
                            label="Highest Educational Attainment"
                            value={(data[eduKey] as string) ?? ''}
                            options={highestEduAttainment}
                            error={errors[eduKey]}
                            onChange={(value) => setData(eduKey, value)}
                            className={
                                !data[eduKey]
                                    ? 'rounded-e-lg'
                                    : 'rounded-e-none'
                            }
                        />
                        {data[eduKey] && (
                            <Button
                                type="button"
                                variant={'destructive'}
                                className="rounded-s-none"
                                onClick={() => setData(eduKey, '')}
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>
                </FormGrid>
            </FormSection>
        );
    };

    return (
        <div className="space-y-6">
            {renderFields('f')}
            {renderFields('m')}
            {data.civil_status === 'Married' && renderFields('s')}
        </div>
    );
}
