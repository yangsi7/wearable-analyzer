import CircleOfCareMember, { CircleOfCareMemberStatus } from "../../domain/models/circle_of_care_member";
import { CircleOfCareDataSource } from "./circle_of_care_data_source";
import { cloneDeep } from 'lodash';

export default class LocalCircleOfCareDataSource implements CircleOfCareDataSource {
    private members: CircleOfCareMember[] = [];

    getCircleOfCareMembers(): Promise<CircleOfCareMember[]> {
        return Promise.resolve(cloneDeep(this.members));
    }

    addCircleOfCareMember(member: CircleOfCareMember): Promise<void> {
        this.members.push(member);
        return Promise.resolve();
    }

    updateCircleOfCareMember(member: CircleOfCareMember): Promise<void> {
        const index = this.members.findIndex(m => m.id === member.id);
        if (index !== -1) {
            this.members[index] = member;
            return Promise.resolve();
        } else {
            return Promise.reject(new Error("Member not found"));
        }
    }

    deleteCircleOfCareMember(memberId: string): Promise<void> {
        const index = this.members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            this.members.splice(index, 1);
            return Promise.resolve();
        } else {
            return Promise.reject(new Error("Member not found"));
        }
    }

    updateCircleOfCareMemberStatus(memberId: string, status: CircleOfCareMemberStatus): Promise<void> {
        const member = this.members.find(m => m.id === memberId);
        if (member) {
            member.status = status;
            return Promise.resolve();
        } else {
            return Promise.reject(new Error("Member not found"));
        }
    }

    async verifyCircleOfCareMember(memberId: string, code: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (code !== "1234") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }, 5000);
        });
    }
}