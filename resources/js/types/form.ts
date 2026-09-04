import type {
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
    | 'created_at'
    | 'updated_at'
    | 'status'
    | 'socio_economic_profile'
    | 'scholarships'
> & {
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
