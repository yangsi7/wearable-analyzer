import React, { useEffect, useRef } from "react";

interface ModalDialogProps {
    title: string;
    titleIcon?: React.ReactNode;
    onConfirm: () => void;
    confirmLabel?: string;
    children: React.ReactNode;
}

export const AnimatedModalDialog = ({ titleIcon, title, children, onConfirm, confirmLabel }: ModalDialogProps,) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slideIn">
                {titleIcon && <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full leading-none">
                        {titleIcon}
                    </div>
                </div>}
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
                    {title}
                </h2>
                {children}
                <button
                    onClick={onConfirm}
                    className="w-full mt-4 glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {confirmLabel || 'OK'}
                </button>
            </div>
        </div>
    );
}

export const BlankAnimatedModalDialog = ({ children, closeDialog }: {
    children: React.ReactNode, closeDialog: () => void
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (event.target instanceof Node && modalRef.current && !modalRef.current.contains(event.target)) {
            closeDialog();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slideIn" ref={modalRef}>
                {children}
            </div>
        </div>
    );
}

