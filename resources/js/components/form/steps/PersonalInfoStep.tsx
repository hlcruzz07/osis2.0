import { capitalizeString } from '@/lib/utils';
import type {
    SetStudentFormData,
    StudentForm,
    StudentFormErrors,
} from '@/types/form';
import type { BrgyProps, CitiesProps, ProvinceProps } from '@/types/location';
import { ComboboxField } from '../ComboboxField';
import { FormGrid } from '../FormGrid';
import { FormSection } from '../FormSection';
import { SelectField } from '../SelectField';

import { TextField } from '../TextField';

interface PersonalInfoStepProps {
    data: StudentForm;
    setData: SetStudentFormData;
    errors: StudentFormErrors;

    suffix: string[];
    gender: string[];
    sexualOrientation: string[];
    civilStatus: string[];

    provinceArr: ProvinceProps[];
    citiesArr: CitiesProps[];
    brgyArr: BrgyProps[];

    onProvinceChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onBarangayChange: (value: string) => void;
    onZipcodeChange: (value: string) => void;
    onStreetChange: (value: string) => void;
}

export function PersonalInfoStep({
    data,
    setData,
    errors,
    suffix,
    gender,
    sexualOrientation,
    civilStatus,
    provinceArr,
    citiesArr,
    brgyArr,
    onProvinceChange,
    onCityChange,
    onBarangayChange,
    onZipcodeChange,
    onStreetChange,
}: PersonalInfoStepProps) {
    return (
        <>
            <FormSection
                title="Personal Information"
                description="Enter your personal information to continue your form."
            >
                <FormGrid>
                    <TextField
                        id="fname"
                        label="First Name"
                        value={data.fname}
                        error={errors.fname}
                        placeholder="Enter First Name"
                        uppercase
                        required
                        onChange={(value) => setData('fname', value)}
                    />

                    <TextField
                        id="mname"
                        label="Middle Name"
                        value={data.mname ?? ''}
                        error={errors.mname}
                        placeholder="Enter Middle Name"
                        onChange={(value) =>
                            setData('mname', capitalizeString(value))
                        }
                    />

                    <TextField
                        id="lname"
                        label="Last Name"
                        value={data.lname}
                        required
                        error={errors.lname}
                        placeholder="Enter Last Name"
                        uppercase
                        onChange={(value) => setData('lname', value)}
                    />

                    <SelectField
                        id="suffix"
                        label="Suffix"
                        value={data.suffix ?? ''}
                        error={errors.suffix ?? ''}
                        options={suffix}
                        onChange={(value) => {
                            if (value === 'NONE') {
                                setData('suffix', '');

                                return;
                            }

                            setData('suffix', value);
                        }}
                    />

                    <TextField
                        id="birthdate"
                        label="Birthdate"
                        required
                        type="date"
                        value={data.birthdate}
                        error={errors.birthdate}
                        onChange={(value) => setData('birthdate', value)}
                    />

                    <TextField
                        id="birthplace"
                        label="Birthplace"
                        value={data.birthplace}
                        error={errors.birthplace}
                        placeholder="Enter Birthplace"
                        maxLength={50}
                        uppercase
                        onChange={(value) =>
                            setData('birthplace', capitalizeString(value))
                        }
                    />

                    <SelectField
                        id="gender"
                        label="Gender"
                        value={data.gender}
                        error={errors.gender}
                        required
                        options={gender}
                        onChange={(value) => setData('gender', value)}
                    />

                    <SelectField
                        id="sexual_orientation"
                        label="Sexual Orientation"
                        value={data.sexual_orientation}
                        error={errors.sexual_orientation}
                        required
                        options={sexualOrientation}
                        onChange={(value) =>
                            setData('sexual_orientation', value)
                        }
                    />
                </FormGrid>

                <SelectField
                    id="civil_status"
                    label="Civil Status"
                    value={data.civil_status}
                    error={errors.civil_status}
                    required
                    options={civilStatus}
                    onChange={(value) => setData('civil_status', value)}
                />
            </FormSection>

            <FormSection
                title="Address"
                description="Where you currently reside."
            >
                <FormGrid>
                    <ComboboxField
                        id="province"
                        label="Province"
                        value={data.address.province}
                        options={provinceArr}
                        disabled={provinceArr.length === 0}
                        valueKey="province_name"
                        labelKey="province_name"
                        error={errors['address.province']}
                        searchPlaceholder="Search province..."
                        emptyMessage="No province found."
                        required
                        onChange={(value: string) =>
                            onProvinceChange(String(value))
                        }
                    />

                    <ComboboxField
                        id="city"
                        label="City/Municipality"
                        value={data.address.city}
                        options={citiesArr}
                        disabled={
                            citiesArr.length === 0 || !data.address.province
                        }
                        valueKey="municipality_name"
                        labelKey="municipality_name"
                        error={errors['address.city']}
                        searchPlaceholder="Search city/municipality..."
                        emptyMessage="No city/municipality found."
                        required
                        onChange={(value: string) =>
                            onCityChange(String(value))
                        }
                    />

                    <ComboboxField
                        id="barangay"
                        label="Barangay"
                        value={data.address.barangay}
                        options={brgyArr}
                        disabled={brgyArr.length === 0 || !data.address.city}
                        valueKey="barangay_name"
                        labelKey="barangay_name"
                        error={errors['address.barangay']}
                        searchPlaceholder="Search barangay..."
                        emptyMessage="No barangay found."
                        required
                        onChange={(value: string) =>
                            onBarangayChange(String(value))
                        }
                    />

                    <TextField
                        id="zip_code"
                        label="Zip Code"
                        required
                        numeric
                        value={data.address.zip_code}
                        error={errors['address.zip_code']}
                        placeholder="Enter Zip Code"
                        onChange={(value) =>
                            onZipcodeChange(String(value.slice(0, 4)))
                        }
                    />
                </FormGrid>

                <div className="flex flex-col">
                    <TextField
                        id="street"
                        label="Street"
                        maxLength={50}
                        required
                        value={data.address.street}
                        error={errors['address.street']}
                        placeholder="Enter Street"
                        onChange={(value) =>
                            onStreetChange(capitalizeString(String(value)))
                        }
                    />
                    <small className="ml-auto block text-muted-foreground">
                        {data.address.street.length} / 50
                    </small>
                </div>
            </FormSection>

            <FormSection
                title="Contact Information"
                description="How the university can reach you."
            >
                <FormGrid>
                    <TextField
                        id="email"
                        type="email"
                        label="Email"
                        required
                        value={data.email}
                        error={errors['email']}
                        placeholder="Enter Email"
                        onChange={(value) => setData('email', value)}
                    />

                    <TextField
                        id="contact_number"
                        label="Contact Number"
                        required
                        numeric
                        value={data.contact_number}
                        error={errors['contact_number']}
                        placeholder="Enter Contact Number"
                        onChange={(value) =>
                            setData('contact_number', value.slice(0, 11))
                        }
                    />
                </FormGrid>
            </FormSection>
        </>
    );
}
