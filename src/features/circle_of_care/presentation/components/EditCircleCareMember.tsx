import { IconButton } from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { useRef, useState } from "react";
import CircleOfCareMember, { CircleOfCareMemberStatus } from "../../domain/models/circle_of_care_member";
import { BlankAnimatedModalDialog } from "../../../../pages/dashboard/components/AnimatedModalDialog";
import { getIconForStatus } from "./CircleOfCareMemberStatusLabel";

interface EditCircleCareMemberProps {
    closeDialog: () => void;
    member: CircleOfCareMember;
    updateMember: (updatedMember: CircleOfCareMember) => void;
    deleteMember: () => void;
}

export default function EditCircleCareMember({ closeDialog, member, updateMember, deleteMember }: EditCircleCareMemberProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(member.name);
    const nameInput = useRef<HTMLInputElement>(null);

    function startEditing() {
        setIsEditing(true);
        setTimeout(() => {
            nameInput.current?.focus();
        }, 0);
    }

    function endEditing() {
        setIsEditing(false);
        const trimmedName = newName.trim();
        if (trimmedName !== member.name && trimmedName.length > 0) {
            member.name = trimmedName;
            updateMember({ ...member, name: newName });
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            endEditing();
        }
    }

    const handleDeleteMember = () => {
        deleteMember();
        closeDialog();
    }

    return (<BlankAnimatedModalDialog closeDialog={closeDialog} >
        <div className="space-y-4">
            {!isEditing &&
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {member.name}
                        </h2>
                        <IconButton onClick={startEditing}>
                            <Edit fontSize="small" />
                        </IconButton>
                    </div>
                    <IconButton onClick={closeDialog} className="ml-auto block">
                        <Close fontSize="small" />
                    </IconButton>
                </div>
            }
            {isEditing &&
                <input defaultValue={member.name} ref={nameInput} onBlur={endEditing} onKeyDown={handleKeyDown} onChange={(e) => setNewName(e.target.value)} className="text-2xl font-bold text-gray-900" />
            }
            <span className="text-gray-600">Phone number: {member.phoneNumber}</span>
            <div className="flex items-center gap-4">
                {getIconForStatus(member.status)}
                <StatusDescription status={member.status} />
            </div>
            <button
                onClick={handleDeleteMember}
                className="w-full mt-4  text-red-400 bg-red-50 p-2 rounded-md"
            >
                Delete member
            </button>
        </div>
    </BlankAnimatedModalDialog>);
}

const StatusDescription = ({ status }: { status: CircleOfCareMemberStatus }) => {
    const getDescription = () => {
        switch (status) {
            case CircleOfCareMemberStatus.PENDING:
                return "We are waiting for the member to accept your invitation.";
            case CircleOfCareMemberStatus.ACCEPTED:
                return "You are sharing reports with this member.";
            case CircleOfCareMemberStatus.REJECTED:
                return "This member has declined your invitation.";
        }
    }

    return (
        <p className="text-gray-600">{getDescription()}</p>
    );
}