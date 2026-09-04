import { usePage } from '@inertiajs/react';

import { useForm } from '@inertiajs/react';
import { LogInIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LAST_STEP, StepIndicator } from '@/components/form/StepIndicator';
import { AcademicPreferencesStep } from '@/components/form/steps/AcademicPreferenceStep';
import { EducationalBackgroundStep } from '@/components/form/steps/EducationalBackgroundStep';
import { FamilyBackgroundStep } from '@/components/form/steps/FamilyBackgroundStep';
import { PersonalInfoStep } from '@/components/form/steps/PersonalInfoStep';
import { PrivacyStatementStep } from '@/components/form/steps/PrivacyStatementStep';
import { ScholarshipStep } from '@/components/form/steps/ScholarshipStep';
import { SocioEconomicStep } from '@/components/form/steps/SocioEconomicStep';
import { SubmittingDialog } from '@/components/student/SubmittingDialog';
import { SuccessDialog } from '@/components/student/SuccessDialog';
import ThemeButton from '@/components/ThemeButton';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useDropdowns } from '@/hooks/use-dropdowns';
import {
    fetchBrgyByCityId,
    fetchCitiesByProvinceId,
    fetchProvinces,
    handleErrors,
} from '@/lib/utils';
import { storeStudent } from '@/routes';
import type { StudentForm } from '@/types/form';
import type { BrgyProps, CitiesProps, ProvinceProps } from '@/types/location';

export type FlashMessages = {
    success?: '';
    error?: '';
    info?: '';
    warning?: '';
};

function getStepForErrorKey(key: string): number | null {
    const steps: [RegExp, number][] = [
        [
            /^(fname|mname|lname|suffix|birthdate|birthplace|gender|sexual_orientation|civil_status|email|contact_number|address\.)/,
            0,
        ],
        [
            /^(course|year_section|date_admitted|entry_status|campus|college|program_applied|major)$/,
            1,
        ],
        [/^(shs_|c_)/, 2],
        [/^(f_|m_|s_)/, 3],
        [/^socio_economic_profile/, 4],
        [/^scholarships/, 5],
        [/^agree_/, 6],
    ];

    return steps.find(([pattern]) => pattern.test(key))?.[1] ?? null;
}
export default function Welcome() {
    const flash: FlashMessages = usePage().props.flash || {};
    const {
        campusDirectory,
        suffix,
        gender,
        sexualOrientation,
        civilStatus,
        entryStatus,
        highestEduAttainment,
        scholarshipProgram,
        schoolType,
    } = useDropdowns();
    const { socioEconomics } = usePage<any>().props;

    const [step, setStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const {
        data,
        setData,
        errors,
        processing,
        post,
        reset,
        progress,
        clearErrors,
    } = useForm<StudentForm>({
        fname: '',
        mname: '',
        lname: '',
        suffix: '',

        course: '',
        year_section: '',
        birthdate: '',
        birthplace: '',

        gender: '',
        sexual_orientation: '',
        civil_status: '',

        email: '',
        contact_number: '',

        campus: '',
        college: '',
        program_applied: '',
        major: '',

        entry_status: '',
        date_admitted: '',

        f_fname: '',
        f_mname: '',
        f_lname: '',
        f_occupation: '',
        f_highest_education: '',

        m_fname: '',
        m_mname: '',
        m_lname: '',
        m_occupation: '',
        m_highest_education: '',

        s_fname: '',
        s_mname: '',
        s_lname: '',
        s_occupation: '',
        s_highest_education: '',

        shs_name: '',
        shs_address: '',
        shs_year: '',
        shs_type: '',

        c_name: '',
        c_address: '',
        c_year: '',
        c_type: '',

        socio_economic_profile: [],
        scholarships: [],

        address: {
            province: '',
            city: '',
            barangay: '',
            street: '',
            zip_code: '',
        },

        agree_accuracy: false,
        agree_data_privacy: false,
    });

    const submitApplication = () => {
        if (processing) {
            return;
        }

        if (!data.agree_accuracy || !data.agree_data_privacy) {
            toast.error('Please agree to both statements before submitting.');

            return;
        }

        post(storeStudent().url, {
            forceFormData: true,
            preserveState: true,
            onError: (errors) => {
                const firstErrorStep = Object.keys(errors)
                    .map(getStepForErrorKey)
                    .find((errorStep) => errorStep !== null);

                if (firstErrorStep !== undefined) {
                    setStep(firstErrorStep);
                }

                console.error('Validation errors:', errors);
                handleErrors(errors);
            },
            onSuccess: (page) => {
                const flashError = (page.props.flash as { error?: string })
                    ?.error;

                if (flashError) {
                    // this was actually your catch-block failure
                    toast.error(flashError);

                    return;
                }

                setShowSuccess(true);
                reset();
                clearErrors();
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitApplication();
    };

    const goNext = () => setStep((prev) => Math.min(prev + 1, LAST_STEP));
    const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

    useEffect(() => {
        if (!flash) {
            return;
        }

        const timeoutId = setTimeout(() => {
            if (flash.success) {
                toast.success(flash.success);
            }

            if (flash.error) {
                toast.error(flash.error);
            }

            if (flash.info) {
                toast.info(flash.info);
            }

            if (flash.warning) {
                toast.warning(flash.warning);
            }
        }, 100);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash.success, flash.error, flash.info, flash.warning]);

    const [provinceArr, setProvinceArr] = useState<ProvinceProps[]>([]);
    const [citiesArr, setCitiesArr] = useState<CitiesProps[]>([]);
    const [brgyArr, setBrgyArr] = useState<BrgyProps[]>([]);

    useEffect(() => {
        fetchProvinces().then(setProvinceArr);
    }, []);

    const handleProvinceChange = (value: string) => {
        setData('address.province', value);
        setData('address.city', '');
        setData('address.barangay', '');

        const province_id = provinceArr.find(
            (item) => item.province_name === value,
        )?.province_id;

        fetchCitiesByProvinceId(Number(province_id)).then(setCitiesArr);
    };

    const handleCityChange = (value: string) => {
        setData('address.city', value);
        setData('address.barangay', '');

        const city_id = citiesArr.find(
            (item) => item.municipality_name === value,
        )?.municipality_id;

        fetchBrgyByCityId(Number(city_id)).then(setBrgyArr);
    };

    const handleBarangayChange = (value: string) => {
        setData('address.barangay', value);
    };

    const handleZipcodeChange = (value: string) => {
        setData('address.zip_code', value);
    };

    const handleStreetChange = (value: string) => {
        setData('address.street', value);
    };

    const campuses = campusDirectory.map(
        (item: { campus: string }) => item.campus,
    );

    const colleges =
        campusDirectory
            .find(
                (item: {
                    campus: string;
                    colleges: { code: string; name: string }[];
                }) => item.campus === data.campus,
            )
            ?.colleges.map(
                (item: { code: string; name: string }) => item.name,
            ) || [];

    const programs =
        campusDirectory
            .find(
                (item: {
                    campus: string;
                    colleges: {
                        code: string;
                        name: string;
                        programs: { name: string; majors: string[] }[];
                    }[];
                }) => item.campus === data.campus,
            )
            ?.colleges.find(
                (item: {
                    code: string;
                    name: string;
                    programs: { name: string; majors: string[] }[];
                }) => item.name === data.college,
            )
            ?.programs?.map(
                (item: { name: string; majors: string[] }) => item.name,
            ) || [];

    const majors =
        campusDirectory
            .find(
                (item: {
                    campus: string;
                    colleges: {
                        code: string;
                        name: string;
                        programs: { name: string; majors: string[] }[];
                    }[];
                }) => item.campus === data.campus,
            )
            ?.colleges.find(
                (item: {
                    code: string;
                    name: string;
                    programs: { name: string; majors: string[] }[];
                }) => item.name === data.college,
            )
            ?.programs.find(
                (item: { name: string; majors: string[] }) =>
                    item.name === data.program_applied,
            )?.majors || [];

    const allPrograms: string[] = Array.from(
        new Set(
            campusDirectory.flatMap(
                (campus: {
                    campus: string;
                    colleges: {
                        code: string;
                        name: string;
                        programs: { name: string; majors: string[] }[];
                    }[];
                }) =>
                    campus.colleges.flatMap((college) =>
                        college.programs.map((program) => program.name),
                    ),
            ),
        ),
    );

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <SuccessDialog
                open={showSuccess}
                onConfirm={() => (window.location.href = '/')}
            />
            <SubmittingDialog
                open={processing}
                title="Submitting Student Data"
                description="Please wait while we validate information. Kindly do not close or refresh this window."
                percentage={progress?.percentage}
            />
            <ThemeButton />

            {/* Branding panel */}
            <div
                className="relative flex min-h-70 items-center justify-center bg-cover bg-center text-center"
                style={{ backgroundImage: "url('/chmsu.webp')" }}
            >
                <div className="absolute inset-0 bg-black/70" />

                <div
                    className="absolute inset-y-0 right-0 hidden w-[3px] lg:block"
                    style={{
                        background:
                            'linear-gradient(180deg, oklch(0.781 0.123 156.451), oklch(0.636 0.108 172.521), oklch(0.490 0.08 176.516))',
                    }}
                />

                <div className="relative z-10 mx-6 flex max-w-5xl flex-col items-center gap-6 py-10 text-center text-white">
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <img
                            src="/logo.webp"
                            className="w-14 sm:w-18"
                            loading="lazy"
                            alt="CHMSU LOGO"
                        />
                        <div className="text-center font-extrabold sm:text-left">
                            <h1 className="text-xl leading-tight sm:text-4xl">
                                CARLOS HILADO
                            </h1>
                            <h1 className="text-base leading-tight text-white/80 sm:text-base">
                                MEMORIAL STATE UNIVERSITY
                            </h1>
                        </div>
                    </div>

                    <div>
                        <p
                            className="text-sm font-semibold tracking-[0.2em] uppercase"
                            style={{ color: 'oklch(0.781 0.123 156.451)' }}
                        >
                            Registrar's Office
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold uppercase sm:text-3xl lg:text-4xl">
                            Online Student Information Sheet
                        </h2>
                    </div>

                    <p className="hidden text-white/75 lg:block">
                        The Online Student Information Sheet (OSIS) is a secure
                        digital platform established to facilitate the
                        collection and management of student records at Carlos
                        Hilado Memorial State University. This system allows
                        students to submit personal, educational, and family
                        information, while enabling the administration to
                        access, organize, and update records promptly and
                        accurately, thereby minimizing the reliance on physical
                        documentation.
                    </p>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && step < LAST_STEP) {
                            e.preventDefault();
                        }
                    }}
                    className="w-full max-w-4xl space-y-6"
                >
                    <StepIndicator currentStep={step} />

                    {step === 0 && (
                        <PersonalInfoStep
                            data={data}
                            setData={setData}
                            errors={errors}
                            suffix={suffix}
                            gender={gender}
                            sexualOrientation={sexualOrientation}
                            civilStatus={civilStatus}
                            provinceArr={provinceArr}
                            citiesArr={citiesArr}
                            brgyArr={brgyArr}
                            onProvinceChange={handleProvinceChange}
                            onCityChange={handleCityChange}
                            onBarangayChange={handleBarangayChange}
                            onStreetChange={handleStreetChange}
                            onZipcodeChange={handleZipcodeChange}
                        />
                    )}

                    {step === 1 && (
                        <AcademicPreferencesStep
                            data={data}
                            setData={setData}
                            reset={reset}
                            errors={errors}
                            allPrograms={allPrograms}
                            campuses={campuses}
                            colleges={colleges}
                            programs={programs}
                            majors={majors}
                            entryStatus={entryStatus}
                        />
                    )}

                    {step === 2 && (
                        <EducationalBackgroundStep
                            data={data}
                            setData={setData}
                            reset={reset}
                            errors={errors}
                            schoolType={schoolType}
                        />
                    )}

                    {step === 3 && (
                        <FamilyBackgroundStep
                            data={data}
                            setData={setData}
                            errors={errors}
                            highestEduAttainment={highestEduAttainment}
                        />
                    )}

                    {step === 4 && (
                        <SocioEconomicStep
                            data={data}
                            setData={setData}
                            reset={reset}
                            errors={errors}
                            socioEconomics={socioEconomics}
                        />
                    )}

                    {step === 5 && (
                        <ScholarshipStep
                            data={data}
                            setData={setData}
                            errors={errors}
                            scholarshipProgram={scholarshipProgram}
                        />
                    )}

                    {step === 6 && (
                        <PrivacyStatementStep data={data} setData={setData} />
                    )}

                    <div className="flex items-center justify-between gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={goBack}
                            disabled={step === 0 || processing}
                        >
                            <ArrowLeftIcon /> Back
                        </Button>

                        {step < LAST_STEP ? (
                            <Button type="button" onClick={goNext}>
                                Next <ArrowRightIcon />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={submitApplication}
                                disabled={
                                    processing ||
                                    !data.agree_accuracy ||
                                    !data.agree_data_privacy
                                }
                            >
                                {processing ? (
                                    <>
                                        <Spinner /> Validating...
                                    </>
                                ) : (
                                    <>
                                        Continue <LogInIcon />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
