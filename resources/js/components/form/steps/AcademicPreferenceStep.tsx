import { XIcon } from 'lucide-react';
import { ComboboxField } from '@/components/form/ComboboxField';
import { FormGrid } from '@/components/form/FormGrid';
import { FormSection } from '@/components/form/FormSection';
import { SelectField } from '@/components/form/SelectField';
import { TextField } from '@/components/form/TextField';

import { Button } from '@/components/ui/button';
import type {
    ResetStudentFormData,
    SetStudentFormData,
    StudentForm,
    StudentFormErrors,
} from '@/types/form';

interface AcademicPreferencesStepProps {
    data: StudentForm;
    setData: SetStudentFormData;
    reset: ResetStudentFormData;
    errors: StudentFormErrors;

    allPrograms: string[];
    campuses: string[];
    colleges: string[];
    programs: string[];
    majors: string[];
    entryStatus: string[];
}

export function AcademicPreferencesStep({
    data,
    setData,
    reset,
    errors,
    allPrograms,
    campuses,
    colleges,
    programs,
    majors,
    entryStatus,
}: AcademicPreferencesStepProps) {
    return (
        <>
            <FormSection
                title="Current Academic Status (Optional)"
                description="Only applicable to continuing or transferee students. If you are a first-year / incoming student, you may skip this section."
            >
                <FormGrid>
                    <div className="flex items-end">
                        <ComboboxField
                            id="course"
                            label="Course"
                            value={data.course}
                            options={allPrograms}
                            disabled={allPrograms.length === 0}
                            error={errors['course']}
                            searchPlaceholder="Search course..."
                            emptyMessage="No course found."
                            onChange={(value: string) =>
                                setData('course', String(value))
                            }
                            className={
                                data.course ? 'rounded-e-none' : undefined
                            }
                        />
                        {data.course && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="rounded-s-none"
                                onClick={() => reset('course')}
                            >
                                <XIcon />
                            </Button>
                        )}
                    </div>

                    <TextField
                        id="year_section"
                        label="Year & Section"
                        value={data.year_section}
                        error={errors['year_section']}
                        placeholder="e.g. 1-B, 3-A1, etc."
                        onChange={(value) => setData('year_section', value)}
                    />
                </FormGrid>
            </FormSection>

            <FormSection
                title="Academic Preferences (Required)"
                description="Select the campus, college, program, and major you are applying to."
            >
                <FormGrid>
                    <TextField
                        id="date_admitted"
                        label="Date Admitted at CHMSU"
                        type="date"
                        value={data.date_admitted}
                        error={errors['date_admitted']}
                        required
                        onChange={(value) => setData('date_admitted', value)}
                    />
                    <SelectField
                        id="entry_status"
                        label="Entry Status"
                        value={data.entry_status}
                        options={entryStatus}
                        required
                        error={errors['entry_status']}
                        onChange={(value) => {
                            setData('entry_status', String(value));
                        }}
                    />
                    <SelectField
                        id="campus"
                        label="Campus"
                        value={data.campus}
                        options={campuses}
                        required
                        error={errors['campus']}
                        onChange={(value) => {
                            setData('campus', String(value));
                            reset('college');
                            reset('program_applied');
                            reset('major');
                        }}
                    />
                    <SelectField
                        id="college"
                        label="College/Department"
                        value={data.college}
                        options={colleges}
                        disabled={colleges.length === 0 || !data.campus}
                        required
                        error={errors['college']}
                        onChange={(value) => {
                            setData('college', String(value));
                            reset('program_applied');
                            reset('major');
                        }}
                    />
                    <SelectField
                        id="program_applied"
                        label="Course / Program Applied For"
                        value={data.program_applied}
                        options={programs}
                        disabled={
                            programs.length === 0 ||
                            !data.campus ||
                            !data.college
                        }
                        required
                        error={errors['program_applied']}
                        onChange={(value) => {
                            setData('program_applied', String(value));
                            reset('major');
                        }}
                    />
                    <SelectField
                        id="major"
                        label="Major"
                        required={majors.length > 0}
                        value={data.major ?? ''}
                        options={majors}
                        disabled={
                            majors.length === 0 ||
                            !data.campus ||
                            !data.college ||
                            !data.program_applied
                        }
                        error={errors['major']}
                        onChange={(value) => setData('major', String(value))}
                    />
                </FormGrid>
            </FormSection>
        </>
    );
}
