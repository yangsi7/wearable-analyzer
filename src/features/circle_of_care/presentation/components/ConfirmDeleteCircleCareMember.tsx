import { BlankAnimatedModalDialog } from "../../../../pages/dashboard/components/AnimatedModalDialog";

interface ConfirmDeleteCircleCareMemberProps {
    onConfirm: () => void;
    onCancel: () => void;
    memberName: string;
}

export const ConfirmDeleteCircleCareMember = ({ onConfirm, onCancel, memberName }: ConfirmDeleteCircleCareMemberProps) => {
    return (
        <BlankAnimatedModalDialog closeDialog={onCancel}>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
                Are you sure you want to remove {memberName} from your circle of care?
            </h2>
            <p className="text-gray-600 mt-4">
                This action cannot be undone.
            </p>
            <div className="flex-column space-y-4">
                <button
                    onClick={onConfirm}
                    className="w-full mt-4 text-red-400 bg-red-50 p-2 rounded-md"
                >
                    Delete member
                </button>
                <button
                    onClick={onCancel}
                    className="w-full mt-4  text-gray-400"
                >
                    Cancel
                </button>
            </div>
        </BlankAnimatedModalDialog>
    );
}