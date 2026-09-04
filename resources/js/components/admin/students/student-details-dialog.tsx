import dayjs from 'dayjs';
import {
    Award,
    ImageIcon,
    UserRound,
    Users,
    GraduationCap,
    ShieldCheck,
    IdCard,
    MessageSquareText,
    ZoomIn,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { driveImage } from '@/routes';
import type { Student } from '@/types/entities';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    student: Student | null;
};

// Reusable label/value pair for the info grids
function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="text-sm font-medium text-foreground">
                {value === null || value === undefined || value === '' ? (
                    <span className="font-normal text-muted-foreground">—</span>
                ) : (
                    value
                )}
            </p>
        </div>
    );
}

function SectionCard({
    title,
    action,
    children,
    className,
}: {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'rounded-xl border bg-card/50 p-4 shadow-sm',
                className,
            )}
        >
            {(title || action) && (
                <div className="mb-3 flex items-center justify-between gap-2">
                    {title && (
                        <p className="text-sm font-semibold text-foreground">
                            {title}
                        </p>
                    )}
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="flex h-40 flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-center">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
    );
}

// Builds a browser-loadable URL from a raw Google Drive file id.
function resolveProofUrl(proof: string | null | undefined): string | null {
    if (!proof) {
        return null;
    }

    return driveImage(proof).url;
}

const NAV_ITEMS = [
    { value: 'personal', label: 'Personal', icon: IdCard },
    { value: 'family', label: 'Family', icon: Users },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'scholarships', label: 'Scholarships', icon: Award },
    { value: 'equity', label: 'Socioeconomic', icon: ShieldCheck },
] as const;

function ImagePreviewDialog({
    open,
    setOpen,
    src,
    label,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    src: string | null;
    label?: string;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] w-fit max-w-[95vw] gap-0 overflow-hidden p-0 sm:max-w-3xl">
                <DialogHeader className="border-b px-4 py-3">
                    <DialogTitle className="text-sm">
                        {label ?? 'Proof'}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex max-h-[calc(90vh-3rem)] items-center justify-center bg-black/5 p-2">
                    {src && (
                        <img
                            src={src}
                            alt={label ?? 'Proof'}
                            className="max-h-[calc(90vh-4.5rem)] w-auto max-w-full rounded-md object-contain"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ProofImage({ src, alt }: { src: string; alt: string }) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
        'loading',
    );

    return (
        <div className="relative aspect-video w-full overflow-hidden">
            {status === 'loading' && (
                <div className="absolute inset-0 overflow-hidden bg-muted/70">
                    <Skeleton className="absolute inset-0 size-full rounded-none bg-linear-to-br from-muted via-muted/60 to-primary/10 opacity-80" />
                    <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-pulse bg-linear-to-r from-transparent via-white/35 to-transparent blur-xl dark:via-white/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background/60 shadow-sm backdrop-blur-sm">
                            <ImageIcon className="size-6 animate-pulse text-muted-foreground/70" />
                        </div>
                    </div>
                </div>
            )}
            {status === 'error' ? (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-6" />
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                    className={cn(
                        'size-full object-cover transition duration-200 group-hover:scale-105',
                        status === 'loading' && 'opacity-0',
                    )}
                />
            )}
        </div>
    );
}

export default function StudentDetailsDialog({
    open,
    setOpen,
    student,
}: Props) {
    const [previewImage, setPreviewImage] = useState<{
        src: string;
        label?: string;
    } | null>(null);

    if (!student) {
        return null;
    }

    const formatName = (...parts: Array<string | null | undefined>) =>
        parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

    const displayName =
        student.full_name ??
        formatName(student.fname, student.mname, student.lname, student.suffix);

    const initials = [student.fname?.[0], student.lname?.[0]]
        .filter(Boolean)
        .join('')
        .toUpperCase();

    const courseYearSection =
        student.course_year_section ??
        [student.course, student.year_section].filter(Boolean).join(' ');

    const addressText =
        student.full_address ??
        ([
            student.address?.street,
            student.address?.barangay,
            student.address?.city,
            student.address?.province,
            student.address?.zip_code,
        ]
            .filter(Boolean)
            .join(', ') ||
            null);

    const contactNumber = student.phone ?? student.contact_number ?? null;
    const birthDate = student.date_of_birth ?? student.birthdate ?? null;
    const placeOfBirth = student.place_of_birth ?? student.birthplace ?? null;

    const father = {
        name: formatName(student.f_fname, student.f_mname, student.f_lname),
        occupation: student.f_occupation,
        education: student.f_highest_education,
    };

    const mother = {
        name: formatName(student.m_fname, student.m_mname, student.m_lname),
        occupation: student.m_occupation,
        education: student.m_highest_education,
    };

    const equityProfiles = student.socio_economic_profile ?? [];
    const familyMembers = [father, mother].filter(
        (member) => member.name || member.occupation || member.education,
    );

    console.log(student);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={cn(
                    'flex w-full flex-col gap-0 overflow-hidden p-0',
                    'h-[90dvh] rounded-none',
                    'sm:h-[85vh] sm:max-h-[85vh] sm:max-w-3xl sm:rounded-lg',
                    'lg:max-w-6xl',
                )}
            >
                <DialogHeader className="flex-none border-b bg-linear-to-r from-primary/5 to-transparent px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:size-11">
                            {initials || <UserRound className="size-5" />}
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="truncate text-sm sm:text-base">
                                {displayName}
                            </DialogTitle>
                            <DialogDescription className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs sm:text-sm">
                                <span>{student.id_number ?? student.id}</span>
                                {courseYearSection && (
                                    <>
                                        <span className="opacity-50">•</span>
                                        <span>{courseYearSection}</span>
                                    </>
                                )}
                                {student.campus && (
                                    <>
                                        <span className="opacity-50">•</span>
                                        <span>{student.campus}</span>
                                    </>
                                )}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <ImagePreviewDialog
                    open={!!previewImage}
                    setOpen={(open) => !open && setPreviewImage(null)}
                    src={previewImage?.src ?? null}
                    label={previewImage?.label}
                />

                <Tabs
                    defaultValue="personal"
                    orientation="vertical"
                    className="min-h-0 w-full flex-1 flex-col gap-0 sm:flex-row"
                >
                    <TabsList
                        className={cn(
                            'flex-none justify-start gap-1 rounded-none bg-muted/30 p-2',
                            'h-auto w-full flex-row overflow-x-auto border-b',
                            'sm:h-full sm:w-44 sm:flex-col sm:items-stretch sm:overflow-visible sm:border-r sm:border-b-0 sm:p-3',
                        )}
                    >
                        {NAV_ITEMS.map(({ value, label, icon: Icon }) => (
                            <TabsTrigger
                                key={value}
                                value={value}
                                className={cn(
                                    'shrink-0 gap-2 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm',
                                    'flex-row justify-center px-3 py-2',
                                    'sm:w-full sm:justify-start',
                                )}
                            >
                                <Icon className="size-4" />
                                <span className="inline">{label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="min-h-0 flex-1">
                        <ScrollArea className="h-full">
                            <TabsContent
                                value="personal"
                                className="m-0 space-y-4 p-4 sm:p-6"
                            >
                                <SectionCard title="Contact & Identity">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <Field
                                            label="Email"
                                            value={student.email}
                                        />
                                        <Field
                                            label="Phone"
                                            value={contactNumber}
                                        />
                                        <Field
                                            label="Gender"
                                            value={student.gender}
                                        />
                                        <Field
                                            label="Civil Status"
                                            value={student.civil_status}
                                        />
                                        <Field
                                            label="Sexual Orientation"
                                            value={student.sexual_orientation}
                                        />
                                        <Field
                                            label="Entry Status"
                                            value={student.entry_status}
                                        />
                                    </div>
                                </SectionCard>

                                <SectionCard title="Background">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <Field
                                            label="Date of Birth"
                                            value={
                                                birthDate
                                                    ? dayjs(birthDate).format(
                                                          'MMM D, YYYY',
                                                      )
                                                    : null
                                            }
                                        />
                                        <Field
                                            label="Age"
                                            value={
                                                birthDate
                                                    ? `${dayjs().diff(
                                                          dayjs(birthDate),
                                                          'year',
                                                      )} yrs old`
                                                    : null
                                            }
                                        />
                                        <Field
                                            label="Place of Birth"
                                            value={placeOfBirth}
                                        />
                                        <Field
                                            label="Nationality"
                                            value={student.nationality}
                                        />
                                        <Field
                                            label="Semester"
                                            value={student.semester}
                                        />
                                        <Field
                                            label="Academic Year"
                                            value={student.academic_year}
                                        />
                                        <Field
                                            label="Campus"
                                            value={student.campus}
                                        />
                                        <Field
                                            label="College"
                                            value={student.college}
                                        />
                                    </div>
                                </SectionCard>

                                <SectionCard title="Address">
                                    <Field
                                        label="Address"
                                        value={addressText}
                                    />
                                </SectionCard>

                                <SectionCard title="Academic Information">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <Field
                                            label="Course"
                                            value={student.course}
                                        />
                                        <Field
                                            label="Year / Section"
                                            value={student.year_section}
                                        />
                                        <Field
                                            label="Program Applied"
                                            value={student.program_applied}
                                        />
                                        <Field
                                            label="Major"
                                            value={student.major}
                                        />
                                        <Field
                                            label="Date Admitted"
                                            value={
                                                student.date_admitted
                                                    ? dayjs(
                                                          student.date_admitted,
                                                      ).format('MMM D, YYYY')
                                                    : null
                                            }
                                        />
                                    </div>
                                </SectionCard>

                                {student.remarks && (
                                    <SectionCard title="Counselor Remarks">
                                        <div className="flex gap-3">
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                <MessageSquareText className="size-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-x-2 gap-y-0.5">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {student.counselor
                                                                ?.name ??
                                                                'Unknown counselor'}
                                                        </p>
                                                        <small>
                                                            {
                                                                student
                                                                    .counselor
                                                                    ?.email
                                                            }
                                                        </small>
                                                    </div>
                                                    {student.remarked_at && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {dayjs(
                                                                student.remarked_at,
                                                            ).format(
                                                                'MMM D, YYYY [at] h:mm A',
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 rounded-lg rounded-tl-none border bg-amber-50 px-3 py-2.5 text-sm text-foreground dark:border-amber-900 dark:bg-amber-950/20">
                                                    {student.remarks}
                                                </div>
                                            </div>
                                        </div>
                                    </SectionCard>
                                )}
                            </TabsContent>

                            <TabsContent
                                value="family"
                                className="m-0 space-y-4 p-4 sm:p-6"
                            >
                                <SectionCard title="Parents' Marital Relationship">
                                    <Field
                                        label="Status"
                                        value={
                                            student.parent_marital_relationship
                                        }
                                    />
                                </SectionCard>

                                {familyMembers.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        {familyMembers.map((member, index) => (
                                            <div
                                                key={`${member.name || 'member'}-${index}`}
                                                className="overflow-hidden rounded-xl border bg-card/50 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                        {member.name ? (
                                                            member.name
                                                                .split(' ')
                                                                .map(
                                                                    (part) =>
                                                                        part[0],
                                                                )
                                                                .join('')
                                                                .slice(0, 2)
                                                                .toUpperCase()
                                                        ) : (
                                                            <UserRound className="size-5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {member.name ||
                                                                'Unnamed parent'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {index === 0
                                                                ? 'Father'
                                                                : 'Mother'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Field
                                                            label="Occupation"
                                                            value={
                                                                member.occupation
                                                            }
                                                        />
                                                        <Field
                                                            label="Education"
                                                            value={
                                                                member.education
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState label="No family information" />
                                )}
                            </TabsContent>

                            <TabsContent
                                value="education"
                                className="m-0 space-y-4 p-4 sm:p-6"
                            >
                                <div className="space-y-4">
                                    {student.shs_name ||
                                    student.shs_address ||
                                    student.shs_year ||
                                    student.shs_type ? (
                                        <SectionCard title="Senior High School">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <Field
                                                    label="School"
                                                    value={student.shs_name}
                                                />
                                                <Field
                                                    label="Address"
                                                    value={student.shs_address}
                                                />
                                                <Field
                                                    label="Year"
                                                    value={student.shs_year}
                                                />
                                                <Field
                                                    label="Type"
                                                    value={student.shs_type}
                                                />
                                            </div>
                                        </SectionCard>
                                    ) : null}

                                    {student.c_name ||
                                    student.c_address ||
                                    student.c_year ||
                                    student.c_type ? (
                                        <SectionCard title="College / Previous School">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <Field
                                                    label="School"
                                                    value={student.c_name}
                                                />
                                                <Field
                                                    label="Address"
                                                    value={student.c_address}
                                                />
                                                <Field
                                                    label="Year"
                                                    value={student.c_year}
                                                />
                                                <Field
                                                    label="Type"
                                                    value={student.c_type}
                                                />
                                            </div>
                                        </SectionCard>
                                    ) : null}

                                    {!student.shs_name &&
                                        !student.shs_address &&
                                        !student.shs_year &&
                                        !student.shs_type &&
                                        !student.c_name &&
                                        !student.c_address &&
                                        !student.c_year &&
                                        !student.c_type && (
                                            <EmptyState label="No education records." />
                                        )}
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="scholarships"
                                className="m-0 space-y-4 p-4 sm:p-6"
                            >
                                {student.scholarships?.length ? (
                                    <div className="space-y-3">
                                        {student.scholarships.map(
                                            (scholarship, index) => (
                                                <div
                                                    key={
                                                        scholarship.id ??
                                                        `${scholarship.name ?? 'scholarship'}-${index}`
                                                    }
                                                    className="rounded-xl border bg-card/50 p-4 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {scholarship.name ??
                                                                'Unnamed scholarship'}
                                                        </p>
                                                        <Badge variant="secondary">
                                                            Scholarship
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <EmptyState label="No scholarship records." />
                                )}
                            </TabsContent>

                            <TabsContent
                                value="equity"
                                className="m-0 space-y-4 p-4 sm:p-6"
                            >
                                {equityProfiles.length ? (
                                    <div className="space-y-4">
                                        {equityProfiles.map(
                                            (profile, index) => {
                                                const proofEntries =
                                                    profile.economic_proofs ??
                                                    profile.student_economic_proofs ??
                                                    [];
                                                const title =
                                                    profile
                                                        .socio_economic_category
                                                        ?.name ??
                                                    'Socioeconomic Profile';

                                                return (
                                                    <div
                                                        key={
                                                            profile.id ?? index
                                                        }
                                                        className="overflow-hidden rounded-xl border bg-card/50 shadow-sm"
                                                    >
                                                        <div className="border-b bg-muted/30 px-4 py-3">
                                                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                                Socioeconomic
                                                                Profile
                                                            </p>
                                                            <p className="text-sm font-semibold text-foreground">
                                                                {title}
                                                            </p>
                                                            {profile.id_number && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    ID:{' '}
                                                                    {
                                                                        profile.id_number
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-3 p-4">
                                                            {proofEntries.length ? (
                                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                    {proofEntries.map(
                                                                        (
                                                                            proofEntry,
                                                                            proofIndex,
                                                                        ) => {
                                                                            const proofUrl =
                                                                                resolveProofUrl(
                                                                                    proofEntry.proof,
                                                                                );

                                                                            return (
                                                                                <button
                                                                                    key={
                                                                                        proofEntry.id ??
                                                                                        `${profile.id ?? index}-proof-${proofIndex}`
                                                                                    }
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        proofUrl &&
                                                                                        setPreviewImage(
                                                                                            {
                                                                                                src: proofUrl,
                                                                                                label: `${title} proof ${proofIndex + 1}`,
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        !proofUrl
                                                                                    }
                                                                                    className="group relative block overflow-hidden rounded-lg border bg-muted/40 text-left disabled:cursor-default"
                                                                                >
                                                                                    {proofUrl ? (
                                                                                        <>
                                                                                            <ProofImage
                                                                                                src={
                                                                                                    proofUrl
                                                                                                }
                                                                                                alt={`${title} proof ${proofIndex + 1}`}
                                                                                            />
                                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                                                                                                <ZoomIn className="size-5 text-white drop-shadow" />
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="flex aspect-video w-full items-center justify-center text-muted-foreground">
                                                                                            <ImageIcon className="size-6" />
                                                                                        </div>
                                                                                    )}
                                                                                </button>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                                                                    No proof
                                                                    uploaded for
                                                                    this
                                                                    profile.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <EmptyState label="No socioeconomic profile records." />
                                )}
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
