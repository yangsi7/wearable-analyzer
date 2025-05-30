import { AccessTime, Cancel, CheckCircle } from "@mui/icons-material";
import { CircleOfCareMemberStatus } from "../../domain/models/circle_of_care_member";

export const CircleOfCareStatusLabel = ({ status, onClick }: { status: CircleOfCareMemberStatus, onClick: () => void }) => {
    const getTitle = () => {
        switch (status) {
            case CircleOfCareMemberStatus.PENDING:
                return "Pending";
            case CircleOfCareMemberStatus.ACCEPTED:
                return "Sharing";
            case CircleOfCareMemberStatus.REJECTED:
                return "Rejected";
        }
    }
    return (<div className="flex gap-2 items-center bg-gray-100 rounded-full px-3 py-1" onClick={onClick}>
        {getIconForStatus(status)}
        <span className="text-gray-600">{getTitle()}</span>
    </div>)

}

export const getIconForStatus = (status: CircleOfCareMemberStatus) => {
    switch (status) {
        case CircleOfCareMemberStatus.PENDING:
            return <AccessTime fontSize="small" />;
        case CircleOfCareMemberStatus.ACCEPTED:
            return <CheckCircle fontSize="small" color="success" />;
        case CircleOfCareMemberStatus.REJECTED:
            return <Cancel fontSize="small" color="error" />;
    }
}