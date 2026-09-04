import { Head, usePage } from '@inertiajs/react';

import dayjs from 'dayjs';
import {
    Award,
    ClockIcon,
    Users,
    UserPlus,
    Mars,
    Venus,
    ChevronDown,
    XIcon,
    CheckCheck,
    UserSearch,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ConfirmStatusChangeDialog from '@/components/admin/students/ConfirmStatusChangeDialog';

import TableFilter from '@/components/admin/students/table-filter';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table-layout';
import apiService from '@/lib/api-service';
import { getStatusLabel } from '@/lib/utils';
import { paginateStudents, updateStatus } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { defaultStudentFilters } from '@/types/entities';
import type {
    StudentFilters,
    PaginateStudents,
    StudentStatus,
    Student,
} from '@/types/entities';
import StudentDetailsDialog from '@/components/admin/students/student-details-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/admin/students',
    },
];

type IndexStats = {
    total: number;
    new_this_week: number;
    pending_review: number;
    with_scholarship: number;
};

type IndexPageProps = {
    stats: IndexStats;
    status: StudentStatus[];
};

export default function Index() {
    const { stats, status } = usePage<IndexPageProps>().props;

    const [students, setStudents] = useState<PaginateStudents | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );

    const [filter, setFilter] = useState<StudentFilters>(defaultStudentFilters);

    const updateFilter = (key: string, value: any) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const fetchStudentsData = async () => {
        try {
            const { data } = await apiService.get(paginateStudents().url, {
                params: filter,
            });

            setStudents(data);
        } catch (error) {
            console.error('Error fetching students', error);
            setStudents(null);
            toast.error('Something went wrong fetching students.');
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            fetchStudentsData();
        }, 500);

        return () => window.clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const tableColumns = [
        '#',
        'Name',
        'Academic Year / Semester',
        'Entry Status',
        'Campus / College',
        'Program Applied / Major',
        'Date',
        'Action',
    ];

    const refresh = async () => {
        const toastId = 'refresh';

        toast.loading('Refreshing...', { id: toastId });

        try {
            await fetchStudentsData();

            toast.success('Refreshed!', {
                id: toastId,
            });
        } catch {
            toast.error('Failed to refresh', {
                id: toastId,
            });
        }
    };

    const widgets = [
        {
            label: 'Total students',
            value: stats?.total ?? 0,
            icon: Users,
        },
        {
            label: 'New this week',
            value: stats?.new_this_week ?? 0,
            icon: UserPlus,
        },
        {
            label: 'Socio-economic review pending',
            value: stats?.pending_review ?? 0,
            icon: ClockIcon,
            warn: true,
        },
        {
            label: 'On scholarship',
            value: stats?.with_scholarship ?? 0,
            icon: Award,
        },
    ];
    const [statusChangeTarget, setStatusChangeTarget] = useState<{
        student: Student;
        newStatus: StudentStatus;
    } | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleConfirmStatusChange = async () => {
        if (!statusChangeTarget) {
            return;
        }

        const { student, newStatus } = statusChangeTarget;
        setIsUpdatingStatus(true);

        try {
            // Adjust the endpoint/method to match your actual route
            await apiService.patch(updateStatus(student.id as number).url, {
                status: newStatus,
            });

            fetchStudentsData();

            toast.success(
                `${student.full_name}'s status updated to ${getStatusLabel(newStatus)}.`,
            );
            setStatusChangeTarget(null);
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Failed to update student status.');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const [openStudentDetails, setOpenStudentDetails] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <ConfirmStatusChangeDialog
                target={statusChangeTarget}
                onOpenChange={setStatusChangeTarget}
                onConfirm={handleConfirmStatusChange}
                isUpdating={isUpdatingStatus}
            />

            <StudentDetailsDialog
                open={openStudentDetails}
                setOpen={setOpenStudentDetails}
                student={selectedStudent}
            />

            <Head title="Students" />
            <div className="m-5 mt-0 flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                <div className="mt-5 flex flex-col divide-y divide-sidebar-border/70 overflow-hidden rounded-md border border-sidebar-border/70 bg-card sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-sidebar-border dark:border-sidebar-border">
                    {widgets.map(({ label, value, icon: Icon, warn }) => (
                        <div
                            key={label}
                            className="flex flex-1 items-baseline justify-between gap-4 px-5 py-4"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {warn && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    )}
                                    {label}
                                </span>
                                <span
                                    className={`text-2xl font-semibold tabular-nums ${
                                        warn
                                            ? 'text-amber-600'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {value.toLocaleString()}
                                </span>
                            </div>
                            <Icon
                                className={`h-4 w-4 shrink-0 ${
                                    warn
                                        ? 'text-amber-500/70'
                                        : 'text-muted-foreground/50'
                                }`}
                            />
                        </div>
                    ))}
                </div>
                <TableLayout>
                    <TableFilter
                        data={filter}
                        setFilter={updateFilter}
                        total={students?.total ?? null}
                        onRefresh={() => {
                            refresh();
                        }}
                        status={status}
                    />

                    <div className="relative mt-3 overflow-x-auto rounded-md lg:border">
                        <table className="table w-full text-left text-xs text-foreground">
                            <thead className="lg:border-b">
                                <tr>
                                    {tableColumns.map((header) => (
                                        <th key={header} scope="col">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="lg:border-b">
                                {students?.data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-muted/50"
                                    >
                                        <td data-label={tableColumns[0]}>
                                            {row.id}
                                        </td>
                                        <td data-label={tableColumns[1]}>
                                            <div className="flex flex-col text-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <p className="m-0! p-0! font-bold">
                                                        {row.full_name}
                                                    </p>

                                                    <small
                                                        className={
                                                            row.gender?.toLowerCase() ===
                                                            'male'
                                                                ? 'flex items-center text-blue-500'
                                                                : 'flex items-center text-pink-500'
                                                        }
                                                    >
                                                        {row.gender?.toLowerCase() ===
                                                        'male' ? (
                                                            <Mars className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Venus className="h-3.5 w-3.5" />
                                                        )}
                                                    </small>
                                                </div>
                                                <small>{row.email}</small>
                                            </div>
                                        </td>
                                        <td data-label={tableColumns[2]}>
                                            {row.academic_year} / {row.semester}
                                        </td>
                                        <td data-label={tableColumns[3]}>
                                            {row.entry_status}
                                        </td>

                                        <td data-label={tableColumns[4]}>
                                            <div className="flex flex-col">
                                                <p className="font-bold">
                                                    {row.campus} Campus
                                                </p>
                                                <small>{row.college}</small>
                                            </div>
                                        </td>
                                        <td data-label={tableColumns[5]}>
                                            <div className="flex flex-col">
                                                <p className="font-bold">
                                                    {row.program_applied}
                                                </p>
                                                <small>
                                                    {row.major ?? '--'}
                                                </small>
                                            </div>
                                        </td>

                                        <td data-label={tableColumns[6]}>
                                            <div className="flex flex-col font-medium">
                                                <small>
                                                    Created:{' '}
                                                    {dayjs(
                                                        row.created_at,
                                                    ).format(
                                                        'MMM D, YYYY hh:mm A',
                                                    )}
                                                </small>
                                                <small
                                                    className={
                                                        row.updated_at !==
                                                        row.created_at
                                                            ? 'text-destructive'
                                                            : ''
                                                    }
                                                >
                                                    Updated:{' '}
                                                    {dayjs(
                                                        row.updated_at,
                                                    ).format(
                                                        'MMM D, YYYY hh:mm A',
                                                    )}
                                                </small>
                                                <small className="text-muted-foreground">
                                                    Admitted:{' '}
                                                    {dayjs(
                                                        row.date_admitted,
                                                    ).format('MMM D, YYYY')}
                                                </small>
                                            </div>
                                        </td>

                                        <td data-label={tableColumns[7]}>
                                            <div className="flex flex-wrap gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Badge
                                                            variant={
                                                                row.status === 0
                                                                    ? 'destructive'
                                                                    : row.status ===
                                                                        1
                                                                      ? 'secondary'
                                                                      : 'default'
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <ChevronDown />
                                                            {getStatusLabel(
                                                                row.status,
                                                            )}
                                                        </Badge>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start">
                                                        <DropdownMenuGroup>
                                                            {status?.map(
                                                                (item) => (
                                                                    <DropdownMenuItem
                                                                        disabled={
                                                                            row.status ===
                                                                            item
                                                                        }
                                                                        className="text-xs"
                                                                        onClick={() =>
                                                                            setStatusChangeTarget(
                                                                                {
                                                                                    student:
                                                                                        row,
                                                                                    newStatus:
                                                                                        item,
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        {item ===
                                                                        0 ? (
                                                                            <XIcon />
                                                                        ) : item ===
                                                                          1 ? (
                                                                            <ClockIcon />
                                                                        ) : (
                                                                            <CheckCheck />
                                                                        )}
                                                                        {getStatusLabel(
                                                                            item,
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                ),
                                                            )}
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                <Badge
                                                    variant={'outline'}
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedStudent(row);
                                                        setOpenStudentDetails(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <UserSearch />
                                                    View
                                                </Badge>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {students?.data.length === 0 || !students ? (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={tableColumns.length}
                                                className="force-center p-3 text-center"
                                            >
                                                No students found.
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    ''
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-6 py-4"
                                    >
                                        <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
                                            <p className="text-sm text-muted-foreground">
                                                Showing{' '}
                                                <span className="font-medium">
                                                    {students?.from}
                                                </span>
                                                –
                                                <span className="font-medium">
                                                    {students?.to}
                                                </span>{' '}
                                                of{' '}
                                                <span className="font-medium">
                                                    {students?.total}
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {students?.links?.map(
                                                    (link, idx) => {
                                                        let page:
                                                            string | null =
                                                            null;

                                                        if (link.url) {
                                                            const url = new URL(
                                                                link.url,
                                                            );
                                                            page =
                                                                url.searchParams.get(
                                                                    'page',
                                                                );
                                                        }

                                                        return (
                                                            <button
                                                                key={idx}
                                                                disabled={
                                                                    !link.url
                                                                }
                                                                onClick={async (
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();

                                                                    if (!page) {
                                                                        return;
                                                                    }

                                                                    try {
                                                                        const {
                                                                            data,
                                                                        } =
                                                                            await apiService.get(
                                                                                paginateStudents()
                                                                                    .url,
                                                                                {
                                                                                    params: {
                                                                                        ...filter,
                                                                                        page,
                                                                                    },
                                                                                },
                                                                            );

                                                                        setStudents(
                                                                            data,
                                                                        );
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Failed to fetch page:',
                                                                            error,
                                                                        );
                                                                    }
                                                                }}
                                                                className={`rounded px-3 py-1 ${
                                                                    link.active
                                                                        ? 'bg-primary text-white dark:text-black'
                                                                        : 'bg-muted text-muted-foreground hover:bg-muted/70'
                                                                }`}
                                                                type="button"
                                                            >
                                                                <span
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </TableLayout>
            </div>
        </AppLayout>
    );
}
