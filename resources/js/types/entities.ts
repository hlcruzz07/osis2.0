export interface Student {
    id?: number;

    semester?: string;
    academic_year?: string;
    fname: string;
    mname: string | null;
    lname: string;
    suffix: string | null;

    course: string;
    year_section: string;
    birthdate: string;
    birthplace: string;

    gender: string;
    sexual_orientation: string;
    civil_status: string;

    email: string;
    contact_number: string;

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
    id_number?: string;

    type?: string | null;
    year_level?: string | null;
    section?: string | null;
    phone?: string | null;
    date_of_birth?: string | null;
    place_of_birth?: string | null;
    nationality?: string | null;
    religion?: string | null;
    height?: string | number | null;
    weight?: string | number | null;
    home_address?: string | null;
    current_address?: string | null;
    last_school_attended?: string | null;
    general_average?: string | number | null;
    strand_course?: string | null;
    has_scholarship?: boolean;
    scholarship?: string | null;
    nature_of_residence?: string | null;
    weekly_allowance?: string | number | null;
    household_income?: string | number | null;
    financer?: string | null;
    birth_order?: string | number | null;
    contact_person?: string | null;
    contact_person_relationship?: string | null;
    contact_person_mobile_um?: string | null;
    contact_person_address?: string | null;
    parent_marital_relationship?: string | null;
    remarks?: string | null;
    remarked_at?: string | null;
    e_signature?: string | null;
    guardians?: Guardian[];
    educations?: Education[];
    siblings?: Sibling[];
    psych_tests?: PsychTest[];
    equity_groups?: EquityGroup[];
    concerns?: Concern[];
    counselor?: Counselor | null;

    full_name?: string;
    course_year_section?: string;
    full_address?: string;

    socio_economic_profile?: StudentSocioEconomicProfile[];
    scholarships?: Scholarship[];
    address: Address;

    created_at?: string;
    updated_at?: string;
}

export interface Guardian {
    id?: number;
    full_name?: string;
    fname?: string | null;
    mname?: string | null;
    lname?: string | null;
    suffix?: string | null;
    relationship?: string | null;
    life_status?: string | null;
    birthdate?: string | null;
    birthplace?: string | null;
    occupation?: string | null;
    phone?: string | null;
    highest_educ_attainment?: string | null;
    religion?: string | null;
    nationality?: string | null;
    cause_of_death?: string | null;
    year_of_death?: string | number | null;
}

export interface Education {
    id?: number;
    education_level?: string | null;
    school_type?: string | null;
    school_name?: string | null;
    year_covered?: string | null;
    honor_receieved?: string | null;
}

export interface Sibling {
    id?: number;
    full_name?: string;
    fname?: string | null;
    mname?: string | null;
    lname?: string | null;
    gender?: string | null;
    is_employed?: boolean;
    birthdate?: string | null;
}

export interface PsychTest {
    id?: number;
    test_name?: string | null;
    date_taken?: string | null;
    test_result?: string | null;
    interpretation?: string | null;
}

export interface EquityGroup {
    id?: number;
    equity_group?: string;
    proof?: string;
}

export interface Concern {
    id?: number;
    question?: string | null;
    answer?: string | null;
}

export interface Counselor {
    name?: string | null;
    email?: string | null;
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
    student_economic_proofs?: StudentEconomicProof[];
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
    desc: string | null;
    with_id: boolean;
    student_socio_economic_profile?: StudentSocioEconomicProfile[];
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
