export default interface CircleOfCareMember {
    id: string;
    name: string;
    phoneNumber: string;
    status: CircleOfCareMemberStatus;
}

export enum CircleOfCareMemberStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}