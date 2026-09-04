import { usePage } from '@inertiajs/react';

export function useDropdowns() {
    const { dropdowns } = usePage<{ dropdowns: any[] }>().props;

    return {
        studentTypes:
            dropdowns?.find((item) => item.name === 'STUDENT TYPE')
                ?.dropdowns || [],
        entryStatus:
            dropdowns?.find((item) => item.name === 'ENTRY STATUS')
                ?.dropdowns || [],
        economicStatus:
            dropdowns?.find((item) => item.name === 'ECONOMIC STATUS')
                ?.dropdowns || [],
        suffix:
            dropdowns?.find((item) => item.name === 'SUFFIX')?.dropdowns || [],
        gender:
            dropdowns?.find((item) => item.name === 'GENDER')?.dropdowns || [],
        sexualOrientation:
            dropdowns?.find((item) => item.name === 'SEXUAL ORIENTATION')
                ?.dropdowns || [],
        sexualOrientations:
            dropdowns?.find((item) => item.name === 'SEXUAL ORIENTATION')
                ?.dropdowns || [],
        civilStatus:
            dropdowns?.find((item) => item.name === 'CIVIL STATUS')
                ?.dropdowns || [],
        maritalRelationships:
            dropdowns?.find((item) => item.name === 'MARITAL RELATIONSHIP')
                ?.dropdowns || [],
        financers:
            dropdowns?.find((item) => item.name === 'FINANCER')?.dropdowns ||
            [],
        houseMonthlyIncomes:
            dropdowns?.find((item) => item.name === 'HOUSE MONTHLY INCOME')
                ?.dropdowns || [],
        natureResidence:
            dropdowns?.find((item) => item.name === 'NATURE OF RESIDENCE')
                ?.dropdowns || [],
        equityGroups:
            dropdowns?.find((item) => item.name === 'EQUITY GROUP')
                ?.dropdowns || [],
        concerns:
            dropdowns?.find((item) => item.name === 'CONCERNS')?.dropdowns ||
            [],
        highestEduAttainment:
            dropdowns?.find(
                (item) => item.name === 'HIGHEST EDUCATIONAL ATTAINTMENT',
            )?.dropdowns || [],
        scholarshipProgram:
            dropdowns?.find((item) => item.name === 'SCHOLARSHIP PROGRAM')
                ?.dropdowns || [],
        schoolType:
            dropdowns?.find((item) => item.name === 'SCHOOL TYPE')?.dropdowns ||
            [],
        campusDirectory:
            dropdowns?.find((item) => item.name === 'CAMPUS DIRECTORY')
                ?.dropdowns || [],
    };
}
