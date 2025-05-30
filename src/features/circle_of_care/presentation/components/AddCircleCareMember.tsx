import { useEffect, useRef } from "react";
import { BlankAnimatedModalDialog } from "../../../../pages/dashboard/components/AnimatedModalDialog";

interface AddCircleCareMemberProps {
    closeDialog: () => void;
    addMember: ({ name, phoneNumber }: { name: string, phoneNumber: string }) => void;
}

export default function AddCircleCareMember({ closeDialog, addMember }: AddCircleCareMemberProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (event.target instanceof Node && modalRef.current && !modalRef.current.contains(event.target)) {
            closeDialog();
        }
    };

    function handleAddMember(formData: FormData) {
        const name = formData.get("name")?.toString().trim();
        const phoneNumber = formData.get("phoneNumber")?.toString().trim();

        if (name && phoneNumber) {
            addMember({ name: name.toString(), phoneNumber: phoneNumber.toString() });
            closeDialog();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (<BlankAnimatedModalDialog closeDialog={closeDialog} >
        <>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Add Circle Care Member
            </h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleAddMember(new FormData(e.target as HTMLFormElement));

            }}>
                <div className="space-y-4 py-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" name="name" className="mt-2 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required={true} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone number</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" className="mt-2 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required={true} />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full mt-4 glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    Add Member
                </button>
                <button
                    onClick={closeDialog}
                    className="w-full mt-4  text-gray-400"
                >
                    Cancel
                </button>
            </form>
        </>
    </BlankAnimatedModalDialog>);
}