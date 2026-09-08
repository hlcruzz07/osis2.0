export interface Student {
    id?: number;

    semester: string | null;
    academic_year: string | null;
    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;
    course: string | null;
    year_section: string | null;
    birthdate: string;
    birthplace: string | null;
    gender: string;
    sexual_orientation: string;
    civil_status: string;
    email: string;
    contact_number: string | null;
    campus: string;
    college: string;
    program_applied: string;
    major: string | null;
    entry_status: string;
    date_admitted: string;
    f_fname: string | null;
    f_mname: string | null;
    f_lname: string | null;
    f_occupation: string | null;
    f_highest_education: string | null;
    m_fname: string | null;
    m_mname: string | null;
    m_lname: string | null;
    m_occupation: string | null;
    m_highest_education: string | null;
    s_fname: string | null;
    s_mname: string | null;
    s_lname: string | null;
    s_occupation: string | null;
    s_highest_education: string | null;
    shs_name: string | null;
    shs_address: string | null;
    shs_year: string | null;
    shs_type: string | null;
    c_name: string | null;
    c_address: string | null;
    c_year: string | null;
    c_type: string | null;
    status: StudentStatus;
    synced_at?: string | null;

    full_name?: string;
    course_year_section?: string;
    full_address?: string;

    socio_economic_profile?: StudentSocioEconomicProfile[];
    scholarships?: Scholarship[];
    address: Address;

    created_at?: string;
    updated_at?: string;
}
export interface PaginateStudents {
    data: Student[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

export enum StudentStatus {
    REJECTED = 0,
    PENDING = 1,
    ACCEPTED = 2,
}
export interface StudentFilters {
    search?: string | null;
    type?: string;
    campus?: string;
    college?: string;
    course?: string;
    major?: string;
    gender?: string;
    status?: StudentStatus | null;
    sort?: string;
    order?: 'asc' | 'desc';
    show?: number;
    date_from?: string | null;
    date_to?: string | null;
}

export const defaultStudentFilters: StudentFilters = {
    search: null,
    type: '',
    campus: '',
    college: '',
    course: '',
    major: '',
    status: null,
    gender: '',
    sort: 'id',
    order: 'desc',
    show: 10,
    date_from: null,
    date_to: null,
};

export interface StudentSocioEconomicProfile {
    id?: number;
    student_id?: number;
    socio_economic_category_id?: number;
    id_number: string | null;
    status?: StudentSocioEconomicProfileStatus;
    student?: Student;
    socio_economic_category?: SocioEconomicCategory;
    economic_proofs?: StudentEconomicProof[];
}

export enum StudentSocioEconomicProfileStatus {
    REJECTED = 0,
    PENDING = 1,
    ACCEPTED = 2,
}

export interface Scholarship {
    id?: number;
    student_id?: number;
    name: string;
    student?: Student;
}

export interface SocioEconomicCategory {
    id?: number;
    code: string;
    name: string;
    description: string | null;
    with_id: boolean;
    student_socio_economic_profiles?: StudentSocioEconomicProfile[];
    created_at?: string;
    updated_at?: string;
}

export interface StudentEconomicProof {
    id?: number;
    socio_economic_profile_id?: number;
    proof: string;
    socio_economic_profile?: StudentSocioEconomicProfile;
}

export interface Address {
    id?: number;
    student_id?: number;
    province: string;
    city: string;
    barangay: string;
    street: string;
    zip_code: string;
}
