import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getStatusLabel } from '@/lib/utils';
import type { Student, StudentStatus } from '@/types/entities';

export type StatusChangeTarget = {
    student: Student;
    newStatus: StudentStatus;
};

type ConfirmStatusChangeDialogProps = {
    target: StatusChangeTarget | null;
    onOpenChange: (target: StatusChangeTarget | null) => void;
    onConfirm: () => void;
    isUpdating: boolean;
};

export default function ConfirmStatusChangeDialog({
    target,
    onOpenChange,
    onConfirm,
    isUpdating,
}: ConfirmStatusChangeDialogProps) {
    return (
        <AlertDialog
            open={!!target}
            onOpenChange={(open) => !open && onOpenChange(null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change student status?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {target && (
                            <>
                                You're about to change{' '}
                                <span className="font-medium text-foreground">
                                    {target.student.full_name}
                                </span>
                                's status from{' '}
                                <span className="font-medium text-foreground">
                                    {getStatusLabel(target.student.status)}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium text-foreground">
                                    {getStatusLabel(target.newStatus)}
                                </span>
                                . This action can be reversed later, but the
                                student may be notified depending on the new
                                status.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
