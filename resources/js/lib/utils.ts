import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import type {
    BrgyProps,
    CitiesProps,
    ProvinceProps,
} from './../types/location';
import { StudentStatus } from '@/types/entities';
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}
export const capitalizeString = (text: string) => {
    if (!text) {
        return '';
    }

    return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const uppercaseString = (text: string) => {
    if (!text) {
        return '';
    }

    return text.trim().toUpperCase();
};

export const fetchNationalities = async (): Promise<string[]> => {
    try {
        const res = await fetch('/nationalities.json');

        if (!res.ok) {
            throw new Error('Failed to fetch nationalities');
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error('Error fetching nationalities', error);

        return [];
    }
};
export const handleErrors = (errors: Record<string, string | string[]>) => {
    const errorKeys = Object.keys(errors);

    // 1. Existing Toast Logic
    errorKeys.reverse().forEach((key) => {
        const messages = errors[key];

        if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(message));
        } else {
            toast.error(messages);
        }
    });

    // 2. Focus Logic: Find the first field with an error
    if (errorKeys.length > 0) {
        // Since we reversed earlier, the first error in the original object is now at the end
        const firstErrorKey = Object.keys(errors)[0];

        // Find element by name or id (common in Inertia forms)
        const element =
            document.getElementsByName(firstErrorKey)[0] ||
            document.getElementById(firstErrorKey);

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            // Optional: smooth scroll if it's a long form
        }
    }
};
export const normalizeName = (name: string) => {
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const fetchProvinces = async (): Promise<ProvinceProps[]> => {
    try {
        const res = await fetch('/table_province.json');

        if (!res.ok) {
            throw new Error('Failed to fetch province');
        }

        const dataProvince: ProvinceProps[] = await res.json();

        return dataProvince;
    } catch (error) {
        console.error('Error fetching province', error);

        return [];
    }
};

export const fetchCitiesByProvinceId = async (
    id: number,
): Promise<CitiesProps[]> => {
    try {
        const res = await fetch('/table_municipality.json');

        if (!res.ok) {
            throw new Error('Failed to fetch municipalities');
        }

        const dataCities: CitiesProps[] = await res.json();

        const cities = dataCities.filter(
            (item: CitiesProps) => Number(item.province_id) === id,
        );

        return cities;
    } catch (error) {
        console.error('Error fetching municipalities', error);

        return [];
    }
};

export const fetchBrgyByCityId = async (id: number): Promise<BrgyProps[]> => {
    try {
        const res = await fetch('/table_barangay.json');

        if (!res.ok) {
            throw new Error('Failed to fetch barangay');
        }

        const dataBrgy: BrgyProps[] = await res.json();

        const brgys = dataBrgy.filter(
            (item: any) => item.municipality_id === id,
        );

        return brgys;
    } catch (error) {
        console.error('Error fetching barangays', error);

        return [];
    }
};
export function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export const getStatusLabel = (status: StudentStatus) => {
    switch (status) {
        case StudentStatus.REJECTED:
            return 'Rejected';
        case StudentStatus.PENDING:
            return 'Pending';
        case StudentStatus.ACCEPTED:
            return 'Accepted';
        default:
            return 'Unknown';
    }
};
export const getEntryStatusClass = (status: string) => {
    switch (status) {
        case 'Regular':
            return 'border-transparent bg-green-700 text-white';

        case 'Transferee':
            return 'border-transparent bg-blue-700 text-white';

        case 'Returnee':
            return 'border-transparent bg-purple-700 text-white';

        case 'Shiftee':
            return 'border-transparent bg-orange-700 text-white';

        case 'Returnee - Shiftee':
            return 'border-transparent bg-pink-700 text-white';

        default:
            return 'border-transparent bg-gray-700 text-white';
    }
};
