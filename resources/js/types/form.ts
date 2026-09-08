import type {
    Address,
    Student,
    StudentEconomicProof,
    StudentSocioEconomicProfile,
} from './entities';

export interface StudentEconomicProofForm extends Omit<
    StudentEconomicProof,
    'proof'
> {
    proof: File | string | null;
}

export interface StudentSocioEconomicProfileForm extends Omit<
    StudentSocioEconomicProfile,
    'student_economic_proofs'
> {
    student_economic_proofs?: StudentEconomicProofForm[];
}

export type StudentForm = Omit<
    Student,
    | 'id'
    | 'semester'
    | 'academic_year'
    | 'created_at'
    | 'updated_at'
    | 'status'
    | 'socio_economic_profile'
    | 'scholarships'
    | 'address'
> & {
    semester?: string;
    academic_year?: string;
    year_section: string;
    birthplace: string;
    contact_number: string;
    address: Address;
    socio_economic_profile?: StudentSocioEconomicProfileForm[];
    scholarships?: string[];
    agree_accuracy: boolean;
    agree_data_privacy: boolean;
};

export type StudentFormErrors = Partial<Record<string, string>>;

export type SetStudentFormData = <K extends keyof StudentForm>(
    key: K,
    value: StudentForm[K],
) => void;

export type ResetStudentFormData = (...fields: (keyof StudentForm)[]) => void;
