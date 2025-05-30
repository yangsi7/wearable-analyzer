import CircleOfCareMember from "../models/circle_of_care_member";

export interface CircleOfCareRepository {
    getCircleOfCareMembers(): Promise<CircleOfCareMember[]>;
    addCircleOfCareMember(member: CircleOfCareMember): Promise<void>;
    updateCircleOfCareMember(member: CircleOfCareMember): Promise<void>;
    deleteCircleOfCareMember(memberId: string): Promise<void>;
    updateCircleOfCareMemberStatus(memberId: string, status: string): Promise<void>;
    verifyCircleOfCareMember(memberId: string, code: string): Promise<boolean>;
}