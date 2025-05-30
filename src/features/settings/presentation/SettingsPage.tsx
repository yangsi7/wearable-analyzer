import { useNavigate } from "react-router-dom"
import CircleOfCareMember, { CircleOfCareMemberStatus } from "../../circle_of_care/domain/models/circle_of_care_member";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { Diversity1, Person, PersonAdd } from "@mui/icons-material";
import { Header } from "../../../common/presentation/components/Header";
import AddCircleCareMember from "../../circle_of_care/presentation/components/AddCircleCareMember";
import EditCircleCareMember from "../../circle_of_care/presentation/components/EditCircleCareMember";
import { ConfirmDeleteCircleCareMember } from "../../circle_of_care/presentation/components/ConfirmDeleteCircleCareMember";
import { CircleOfCareStatusLabel } from "../../circle_of_care/presentation/components/CircleOfCareMemberStatusLabel";
import { useCircleOfCareProvider } from "../../circle_of_care/presentation/CircleOfCareProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../common/presentation/components/LoadingSpinner";

export const SettingsPage = () => {
    const navigate = useNavigate();
    const circleOfCareProvider = useCircleOfCareProvider();

    const queryClient = useQueryClient();

    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const [editingMember, setEditingMember] = useState<CircleOfCareMember | null>(null);
    const [confirmDeletingMember, setConfirmDeletingMember] = useState<CircleOfCareMember | null>(null);


    const query = useQuery({
        queryKey: ['circleOfCareMembers'],
        queryFn: () => circleOfCareProvider.getCircleOfCareMembers()

    })



    const addMemberMutation = useMutation({
        mutationFn: async (member: CircleOfCareMember) => {
            console.log('Adding member', member);
            return circleOfCareProvider.addCircleOfCareMember(member);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['circleOfCareMembers'] })
        },
    })

    const addMember = async ({ name, phoneNumber }: { name: string, phoneNumber: string }) => {
        // Add a new member to the circle of care
        const uniqueId = Math.random().toString(36).substring(7);
        const member = { id: uniqueId, name, phoneNumber, status: CircleOfCareMemberStatus.PENDING };
        addMemberMutation.mutate(member);
    }

    const removeMemberMutation = useMutation({
        mutationFn: (memberId: string) => circleOfCareProvider.deleteCircleOfCareMember(memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['circleOfCareMembers'] })
        }
    })

    const removeMember = async (memberId: string) => {
        setConfirmDeletingMember(null);
        removeMemberMutation.mutate(memberId);
    }

    const updateMemberStatusMutation = useMutation({
        mutationFn: ({ memberId, status }: { memberId: string, status: CircleOfCareMemberStatus }) => circleOfCareProvider.updateCircleOfCareMemberStatus(memberId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['circleOfCareMembers'] })
        }
    })

    const updateMemberStatus = async (memberId: string, status: CircleOfCareMemberStatus) => {
        updateMemberStatusMutation.mutate({ memberId, status });
    }

    const updateMemberMutation = useMutation({
        mutationFn: circleOfCareProvider.updateCircleOfCareMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['circleOfCareMembers'] })
        }
    })

    const updateMember = async (updatedMember: CircleOfCareMember) => {
        updateMemberMutation.mutate(updatedMember);
    }

    console.log('query', query);
    const hasCircleOfCareMembers = query.data && query.data.length > 0;

    return (
        <div className="min-h-screen bg-gray-100 max-w-md mx-auto ">
            {showAddMemberDialog && <AddCircleCareMember closeDialog={() => setShowAddMemberDialog(false)} addMember={addMember} />}
            {editingMember && <EditCircleCareMember closeDialog={() => setEditingMember(null)} member={editingMember} updateMember={updateMember} deleteMember={() => setConfirmDeletingMember(editingMember)} />}
            {confirmDeletingMember && <ConfirmDeleteCircleCareMember onConfirm={() => { removeMember(confirmDeletingMember.id); setConfirmDeletingMember(null); }} onCancel={() => setConfirmDeletingMember(null)} memberName={confirmDeletingMember.name} />}
            <Header title={"Settings"} onBackClick={() => navigate(-1)} />
            <div className="px-4 py-6 space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Diversity1 fontSize="small" />
                            <h2 className="text-xl font-medium text-gray-700">Circle of care</h2>
                        </div>
                        {hasCircleOfCareMembers && <div className="flex items-center gap-2">
                            <IconButton onClick={() => setShowAddMemberDialog(true)}>
                                <PersonAdd />
                            </IconButton>
                        </div>}
                    </div>
                    {query.isLoading && <LoadingSpinner title="Loading circle of care..." />}
                    {!query.isLoading && !hasCircleOfCareMembers &&
                        <div>
                            <p className="text-gray-600 text-center px-2 py-4">
                                Add members to Circle of Care to share reports with your caregivers or loved ones.
                            </p>
                            <button className="bg-blue-500 text-white rounded-md px-4 py-2 w-full" onClick={() => setShowAddMemberDialog(true)}>Add member</button>
                        </div>
                    }
                    {hasCircleOfCareMembers &&
                        <ul className="mt-4 divide-y">
                            {query.data.map((member) => (
                                <li key={member.id} className="flex items-center justify-between divide-gray-200 py-2" >
                                    <div onClick={() => setEditingMember(member)} className=" flex items-center gap-2">
                                        <Person fontSize="small" />
                                        <h3 className="text-gray-900">{member.name}</h3>
                                    </div>
                                    <CircleOfCareStatusLabel status={member.status} onClick={() => updateMemberStatus(member.id, member.status == CircleOfCareMemberStatus.PENDING ? CircleOfCareMemberStatus.ACCEPTED : CircleOfCareMemberStatus.REJECTED)} />
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-medium text-gray-700">Account</h2>
                    </div>
                    <ul className="mt-4 divide-y">
                        <li className="flex items-center justify-between divide-gray-200 py-2" onClick={() => navigate('/circle-of-care/onboarding')}>
                            <div className=" flex items-center gap-2">
                                <Person fontSize="small" />
                                <h3 className="text-gray-900">Circle of care onboarding</h3>
                            </div>
                        </li>
                    </ul>
                    <ul className="mt-4 divide-y">
                        <li className="flex items-center justify-between divide-gray-200 py-2" onClick={() => navigate('/dashboard/summary')}>
                            <div className=" flex items-center gap-2">
                                <Person fontSize="small" />
                                <h3 className="text-gray-900">Report summary</h3>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}

