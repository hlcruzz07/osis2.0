// resources/js/components/form/steps/SocioEconomicStep.tsx
import { CheckCheck, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getCookie, setCookie } from '@/lib/utils';
import type { SocioEconomicCategory } from '@/types/entities';

import type {
    ResetStudentFormData,
    SetStudentFormData,
    StudentForm,
    StudentFormErrors,
} from '@/types/form';
import { SocioEconomicCheckboxField } from '../SocioEconomicCheckboxField';

interface SocioEconomicStepProps {
    data: StudentForm;
    setData: SetStudentFormData;
    reset?: ResetStudentFormData;
    errors: StudentFormErrors;
    socioEconomics: SocioEconomicCategory[];
}

const WARNING_COOKIE = 'osis_hide_socioeconomic_warning';
const WARNING_COOKIE_DAYS = 4;

export function SocioEconomicStep({
    data,
    setData,
    errors,
    socioEconomics,
}: SocioEconomicStepProps) {
    const [isUploadWarningOpen, setIsUploadWarningOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const hasAcknowledged = getCookie(WARNING_COOKIE);

        if (!hasAcknowledged) {
            const timeoutId = window.setTimeout(() => {
                setIsUploadWarningOpen(true);
            }, 0);

            return () => window.clearTimeout(timeoutId);
        }
    }, []);

    const handleAcknowledge = () => {
        if (dontShowAgain) {
            setCookie(WARNING_COOKIE, '1', WARNING_COOKIE_DAYS);
        }

        setIsUploadWarningOpen(false);
    };

    return (
        <>
            <FormSection
                title="Socio Economic Profile (Optional)"
                description="Please check the appropriate box or boxes and provide the necessary information accurately and completely."
            >
                <FormGrid columns={1}>
                    {socioEconomics.map((category, index) => {
                        const profile = data.socio_economic_profile?.find(
                            (item) =>
                                item.socio_economic_category_id === category.id,
                        );

                        return (
                            <SocioEconomicCheckboxField
                                key={category.id}
                                category={category}
                                value={profile}
                                error={
                                    errors[`socio_economic_profile.${index}`]
                                }
                                onChange={(value) => {
                                    const profiles = [
                                        ...(data.socio_economic_profile ?? []),
                                    ];

                                    const index = profiles.findIndex(
                                        (item) =>
                                            item.socio_economic_category_id ===
                                            category.id,
                                    );

                                    if (!value) {
                                        if (index !== -1) {
                                            profiles.splice(index, 1);
                                        }
                                    } else if (index !== -1) {
                                        profiles[index] = value;
                                    } else {
                                        profiles.push(value);
                                    }

                                    setData('socio_economic_profile', profiles);
                                }}
                            />
                        );
                    })}
                </FormGrid>
            </FormSection>

            <AlertDialog open={isUploadWarningOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 capitalize">
                            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <TriangleAlert className="size-5" />
                            </div>
                            Important supporting document notice
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mt-3">
                            <p>
                                Upload only authentic documents that directly
                                support your socioeconomic profile. Do not
                                upload nude, sexually explicit, abusive, or
                                otherwise inappropriate images, or documents
                                belonging to another person.
                                <br /> <br />
                                Uploaded files may be reviewed, recorded, and
                                associated with your application for admission
                                and data privacy compliance. False, misleading,
                                inappropriate, or unauthorized submissions may
                                result in disqualification from admission to the
                                University and other appropriate action.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                            id="dont-show-again"
                            checked={dontShowAgain}
                            onCheckedChange={(checked) =>
                                setDontShowAgain(!!checked)
                            }
                        />
                        <Label
                            htmlFor="dont-show-again"
                            className="cursor-pointer text-sm font-normal text-muted-foreground"
                        >
                            Don't show this again
                        </Label>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleAcknowledge}>
                            <CheckCheck /> I Understand and Agree
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
