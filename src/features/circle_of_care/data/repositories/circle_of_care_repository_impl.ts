import CircleOfCareMember from "../../domain/models/circle_of_care_member";
import { CircleOfCareRepository } from "../../domain/repositories/circle_of_care_repository";
import { CircleOfCareDataSource } from "../data_source/circle_of_care_data_source";

export default class CircleOfCareRepositoryImpl implements CircleOfCareRepository {
    constructor(private dataSource: CircleOfCareDataSource) { }

    getCircleOfCareMembers(): Promise<CircleOfCareMember[]> {
        return this.dataSource.getCircleOfCareMembers();
    }
    addCircleOfCareMember(member: CircleOfCareMember): Promise<void> {
        return this.dataSource.addCircleOfCareMember(member);
    }
    updateCircleOfCareMember(member: CircleOfCareMember): Promise<void> {
        return this.dataSource.updateCircleOfCareMember(member);
    }
    deleteCircleOfCareMember(memberId: string): Promise<void> {
        return this.dataSource.deleteCircleOfCareMember(memberId);
    }
    updateCircleOfCareMemberStatus(memberId: string, status: string): Promise<void> {
        return this.dataSource.updateCircleOfCareMemberStatus(memberId, status);
    }

    verifyCircleOfCareMember(memberId: string, code: string): Promise<boolean> {
        return this.dataSource.verifyCircleOfCareMember(memberId, code);
    }
}