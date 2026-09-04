<?php

namespace App\Http\Requests;

use App\Models\SocioEconomicCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreStudentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fname' => ['required', 'string', 'max:100'],
            'mname' => ['nullable', 'string', 'max:100'],
            'lname' => ['required', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:30'],
            'birthdate' => ['required', 'date', 'before:today'],
            'birthplace' => ['nullable', 'string', 'max:100'],
            'gender' => ['required', 'string', 'max:50'],
            'sexual_orientation' => ['required', 'string', 'max:50'],
            'civil_status' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:255'],
            'contact_number' => [
                'required',
                'starts_with:09',
                'digits:11',
            ],

            'address' => ['required', 'array'],
            'address.province' => ['required', 'string', 'max:100'],
            'address.city' => ['required', 'string', 'max:100'],
            'address.barangay' => ['required', 'string', 'max:100'],
            'address.street' => ['required', 'string', 'max:150'],
            'address.zip_code' => ['required', 'string', 'regex:/^[0-9]{4}$/'],

            'course' => ['nullable', 'string', 'max:150'],
            'year_section' => ['nullable', 'string', 'max:50', 'regex:/^[1-4]-[A-Z][0-9]*$/i'],
            'date_admitted' => ['required', 'date'],
            'entry_status' => ['required', 'string', 'max:100'],
            'campus' => ['required', 'string', 'max:100'],
            'college' => ['required', 'string', 'max:150'],
            'program_applied' => ['required', 'string', 'max:150'],
            'major' => ['nullable', 'string', 'max:150'],

            'f_fname' => ['nullable', 'string', 'max:100'],
            'f_mname' => ['nullable', 'string', 'max:100'],
            'f_lname' => ['nullable', 'string', 'max:100'],
            'f_occupation' => ['nullable', 'string', 'max:100'],
            'f_highest_education' => ['nullable', 'string', 'max:150'],
            'm_fname' => ['nullable', 'string', 'max:100'],
            'm_mname' => ['nullable', 'string', 'max:100'],
            'm_lname' => ['nullable', 'string', 'max:100'],
            'm_occupation' => ['nullable', 'string', 'max:100'],
            'm_highest_education' => ['nullable', 'string', 'max:150'],
            's_fname' => ['nullable', 'string', 'max:100'],
            's_mname' => ['nullable', 'string', 'max:100'],
            's_lname' => ['nullable', 'string', 'max:100'],
            's_occupation' => ['nullable', 'string', 'max:100'],
            's_highest_education' => ['nullable', 'string', 'max:150'],
            'shs_name' => ['nullable', 'string', 'max:150'],
            'shs_address' => ['nullable', 'string', 'max:150'],
            'shs_year' => ['nullable', 'digits:4'],
            'shs_type' => ['nullable', 'string', 'max:100'],
            'c_name' => ['nullable', 'string', 'max:150'],
            'c_address' => ['nullable', 'string', 'max:150'],
            'c_year' => ['nullable', 'digits:4'],
            'c_type' => ['nullable', 'string', 'max:100'],

            'socio_economic_profile' => ['nullable', 'array'],
            'socio_economic_profile.*' => ['required', 'array'],
            'socio_economic_profile.*.socio_economic_category_id' => [
                'required',
                'integer',
                Rule::exists('socio_economic_categories', 'id'),
            ],
            'socio_economic_profile.*.id_number' => [
                'nullable',
                'string',
                'max:100',
            ],
            'socio_economic_profile.*.status' => [
                'required',
                Rule::in([1]),
            ],
            'socio_economic_profile.*.student_economic_proofs' => [
                'required',
                'array',
                'min:1',
            ],
            'socio_economic_profile.*.student_economic_proofs.*' => [
                'required',

            ],

            'scholarships' => ['nullable', 'array'],
            'scholarships.*' => ['string', 'max:255'],
            'agree_accuracy' => ['accepted'],
            'agree_data_privacy' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'fname.required' => 'Please enter your first name.',
            'fname.string' => 'First name must be text.',
            'fname.max' => 'First name may not exceed 100 characters.',
            'mname.string' => 'Middle name must be text.',
            'mname.max' => 'Middle name may not exceed 100 characters.',
            'lname.required' => 'Please enter your last name.',
            'lname.string' => 'Last name must be text.',
            'lname.max' => 'Last name may not exceed 100 characters.',
            'suffix.string' => 'Suffix must be text.',
            'suffix.max' => 'Suffix may not exceed 30 characters.',
            'birthdate.required' => 'Please enter your birthdate.',
            'birthdate.date' => 'Please enter a valid birthdate.',
            'birthdate.before' => 'Birthdate must be before today.',
            'birthplace.string' => 'Birthplace must be text.',
            'birthplace.max' => 'Birthplace may not exceed 100 characters.',
            'gender.required' => 'Please select your gender.',
            'gender.string' => 'Gender must be text.',
            'gender.max' => 'Gender selection is too long.',
            'sexual_orientation.required' => 'Please select your sexual orientation.',
            'sexual_orientation.string' => 'Sexual orientation must be text.',
            'sexual_orientation.max' => 'Sexual orientation selection is too long.',
            'civil_status.required' => 'Please select your civil status.',
            'civil_status.string' => 'Civil status must be text.',
            'civil_status.max' => 'Civil status selection is too long.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email address may not exceed 255 characters.',
            'contact_number.required' => 'Please enter your contact number.',
            'contact_number.starts_with' => 'Contact number must starts with 09.',
            'contact_number.digits' => 'Contact number must be exactly 11 digits.',

            'address.required' => 'Please complete your address.',
            'address.array' => 'Address information is invalid.',
            'address.province.required' => 'Please select your province.',
            'address.province.string' => 'Province must be text.',
            'address.province.max' => 'Province name is too long.',
            'address.city.required' => 'Please select your city or municipality.',
            'address.city.string' => 'City or municipality must be text.',
            'address.city.max' => 'City or municipality name is too long.',
            'address.barangay.required' => 'Please select your barangay.',
            'address.barangay.string' => 'Barangay must be text.',
            'address.barangay.max' => 'Barangay name is too long.',
            'address.street.required' => 'Please enter your street address.',
            'address.street.string' => 'Street address must be text.',
            'address.street.max' => 'Street address may not exceed 150 characters.',
            'address.zip_code.required' => 'Please enter your ZIP code.',
            'address.zip_code.string' => 'ZIP code must be text.',
            'address.zip_code.regex' => 'Enter a valid 4-digit ZIP code.',

            'course.string' => 'Course must be text.',
            'course.max' => 'Course may not exceed 150 characters.',
            'year_section.string' => 'Year and section must be text.',
            'year_section.max' => 'Year and section may not exceed 50 characters.',
            'year_section.regex' => 'Year & Section must follow the format "Year-Section" (e.g., 1-B, 4-A1).',
            'date_admitted.required' => 'Please enter your admission date.',
            'date_admitted.date' => 'Please enter a valid admission date.',
            'date_admitted.before_or_equal' => 'Admission date cannot be in the future.',
            'entry_status.required' => 'Please select your entry status.',
            'entry_status.string' => 'Entry status must be text.',
            'entry_status.max' => 'Entry status selection is too long.',
            'campus.required' => 'Please select a campus.',
            'campus.string' => 'Campus must be text.',
            'campus.max' => 'Campus selection is too long.',
            'college.required' => 'Please select a college or department.',
            'college.string' => 'College or department must be text.',
            'college.max' => 'College or department selection is too long.',
            'program_applied.required' => 'Please select the program you are applying for.',
            'program_applied.string' => 'Applied program must be text.',
            'program_applied.max' => 'Applied program selection is too long.',
            'major.string' => 'Major must be text.',
            'major.max' => 'Major may not exceed 150 characters.',

            'f_fname.string' => "Father's first name must be text.",
            'f_fname.max' => "Father's first name may not exceed 100 characters.",
            'f_mname.string' => "Father's middle name must be text.",
            'f_mname.max' => "Father's middle name may not exceed 100 characters.",
            'f_lname.string' => "Father's last name must be text.",
            'f_lname.max' => "Father's last name may not exceed 100 characters.",
            'f_occupation.string' => "Father's occupation must be text.",
            'f_occupation.max' => "Father's occupation may not exceed 100 characters.",
            'f_highest_education.string' => "Father's education must be text.",
            'f_highest_education.max' => "Father's education may not exceed 150 characters.",
            'm_fname.string' => "Mother's first name must be text.",
            'm_fname.max' => "Mother's first name may not exceed 100 characters.",
            'm_mname.string' => "Mother's middle name must be text.",
            'm_mname.max' => "Mother's middle name may not exceed 100 characters.",
            'm_lname.string' => "Mother's last name must be text.",
            'm_lname.max' => "Mother's last name may not exceed 100 characters.",
            'm_occupation.string' => "Mother's occupation must be text.",
            'm_occupation.max' => "Mother's occupation may not exceed 100 characters.",
            'm_highest_education.string' => "Mother's education must be text.",
            'm_highest_education.max' => "Mother's education may not exceed 150 characters.",
            's_fname.string' => "Spouse's first name must be text.",
            's_fname.max' => "Spouse's first name may not exceed 100 characters.",
            's_mname.string' => "Spouse's middle name must be text.",
            's_mname.max' => "Spouse's middle name may not exceed 100 characters.",
            's_lname.string' => "Spouse's last name must be text.",
            's_lname.max' => "Spouse's last name may not exceed 100 characters.",
            's_occupation.string' => "Spouse's occupation must be text.",
            's_occupation.max' => "Spouse's occupation may not exceed 100 characters.",
            's_highest_education.string' => "Spouse's education must be text.",
            's_highest_education.max' => "Spouse's education may not exceed 150 characters.",
            'shs_name.string' => 'Senior high school name must be text.',
            'shs_name.max' => 'Senior high school name may not exceed 150 characters.',
            'shs_address.string' => 'Senior high school address must be text.',
            'shs_address.max' => 'Senior high school address may not exceed 150 characters.',
            'shs_year.digits' => 'Senior high school year must contain 4 digits.',
            'shs_type.string' => 'Senior high school type must be text.',
            'shs_type.max' => 'Senior high school type may not exceed 100 characters.',
            'c_name.string' => 'College name must be text.',
            'c_name.max' => 'College name may not exceed 150 characters.',
            'c_address.string' => 'College address must be text.',
            'c_address.max' => 'College address may not exceed 150 characters.',
            'c_year.digits' => 'College year must contain 4 digits.',
            'c_type.string' => 'College type must be text.',
            'c_type.max' => 'College type may not exceed 100 characters.',

            'socio_economic_profile.array' => 'Socioeconomic profile information is invalid.',
            'socio_economic_profile.*.required' => 'Each socioeconomic profile entry is required.',
            'socio_economic_profile.*.array' => 'Each socioeconomic profile entry is invalid.',
            'socio_economic_profile.*.socio_economic_category_id.required' => 'Please select a socioeconomic category.',
            'socio_economic_profile.*.socio_economic_category_id.integer' => 'Socioeconomic category is invalid.',
            'socio_economic_profile.*.socio_economic_category_id.exists' => 'The selected socioeconomic category is invalid.',
            'socio_economic_profile.*.id_number.string' => 'Identification number must be text.',
            'socio_economic_profile.*.id_number.max' => 'Identification number may not exceed 100 characters.',
            'socio_economic_profile.*.status.required' => 'Socioeconomic profile status is required.',
            'socio_economic_profile.*.status.in' => 'Socioeconomic profile status is invalid.',
            'socio_economic_profile.*.student_economic_proofs.required' => 'At least one supporting document is required for each selected category.',
            'socio_economic_profile.*.student_economic_proofs.array' => 'Supporting documents are invalid.',
            'socio_economic_profile.*.student_economic_proofs.min' => 'At least one supporting document is required for each selected category.',
            'socio_economic_profile.*.student_economic_proofs.*.required' => 'Each supporting document is required.',
            'socio_economic_profile.*.student_economic_proofs.*.image' => 'Supporting documents must be valid image files.',
            'socio_economic_profile.*.student_economic_proofs.*.max' => 'Each supporting document must not exceed 5 MB.',

            'scholarships.array' => 'Scholarship information is invalid.',
            'scholarships.*.string' => 'Each scholarship entry must be text.',
            'scholarships.*.max' => 'Each scholarship entry may not exceed 255 characters.',
            'agree_accuracy.accepted' => 'You must confirm that the information provided is accurate.',
            'agree_data_privacy.accepted' => 'You must accept the data privacy statement.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            foreach ($this->input('socio_economic_profile', []) as $index => $profile) {
                $category = SocioEconomicCategory::find(
                    $profile['socio_economic_category_id'] ?? null,
                );

                if ($category?->with_id && blank($profile['id_number'] ?? null)) {
                    $validator->errors()->add(
                        "socio_economic_profile.{$index}.id_number",
                        'An identification number is required for this category.',
                    );
                }
            }
        });
    }
}
