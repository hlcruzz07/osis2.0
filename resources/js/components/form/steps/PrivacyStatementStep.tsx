import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { SetStudentFormData, StudentForm } from '@/types/form';
import { FormSection } from '../FormSection';

interface PrivacyStatementStepProps {
    data: StudentForm;
    setData: SetStudentFormData;
}

export function PrivacyStatementStep({
    data,
    setData,
}: PrivacyStatementStepProps) {
    return (
        <FormSection
            title="Privacy Statement"
            description="Please read and confirm both statements below before submitting your application."
        >
            <div className="flex flex-col gap-6">
                <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                    <Checkbox
                        id="agree_accuracy"
                        checked={data.agree_accuracy}
                        onCheckedChange={(checked) =>
                            setData('agree_accuracy', checked === true)
                        }
                        className="mt-0.5"
                    />
                    <Label
                        htmlFor="agree_accuracy"
                        className="text-sm leading-relaxed font-normal"
                    >
                        I hereby declare that all information provided in this
                        form is accurate and that any false statement or
                        information declared herein may be ground for my
                        disqualification from admission in the University.
                    </Label>
                </div>

                <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
                    <Checkbox
                        id="agree_data_privacy"
                        checked={data.agree_data_privacy}
                        onCheckedChange={(checked) =>
                            setData('agree_data_privacy', checked === true)
                        }
                        className="mt-0.5"
                    />
                    <Label
                        htmlFor="agree_data_privacy"
                        className="text-sm leading-relaxed font-normal"
                    >
                        I hereby allow CHMSU to collect, use, and process this
                        information for the purpose of enrollment, legitimate
                        academic activities, and other information processes in
                        accordance with the implementing rules and regulations
                        of the Data Privacy Act of 2012.
                    </Label>
                </div>

                {(!data.agree_accuracy || !data.agree_data_privacy) && (
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertDescription>
                            You must agree to both statements above before you
                            can submit your application.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </FormSection>
    );
}
