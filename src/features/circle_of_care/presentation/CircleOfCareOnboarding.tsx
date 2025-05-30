import { Link, useNavigate } from "react-router-dom";
import { useCircleOfCareProvider } from "./CircleOfCareProvider";
import { useState } from "react";
import { Diversity1 } from "@mui/icons-material";
import { useAuth } from "../../auth/presentation/AuthProvider";

interface WelcomeScreenProps {
    goToNextPage: () => void;
    patientName: string;
}

const WelcomeScreen = ({ goToNextPage, patientName }: WelcomeScreenProps) => {
    return (
        <div className="min-h-screen max-w-md flex flex-col justify-center items-center">
            <div className="p-4 space-y-4 text-center text-gray-900">
                <div className="bg-blue-100 p-4 rounded-full leading-none w-min mx-auto">
                    <Diversity1 style={{ fontSize: '60px' }} />
                </div>
                <h1 className="text-2xl font-bold ">Welcome to Circle of Care</h1>
                <p className="text-lg ">You have been invited by {patientName} to join their Circle of Care.</p>
                <p className="text-base text-gray-600 ">Circle of Care is a feature that provides you with daily updates on the heart health of your loved ones.</p>
            </div>
            <button
                onClick={() => goToNextPage()}
                className="absolute bottom-0 m-4 mb-6 left-0 right-0  mt-4 glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Accept invitation
            </button>
        </div>
    )
}

export const VerificationCodePage = ({ memberId, patientName, goToNextPage }: { memberId: string, patientName: string, goToNextPage: () => void }) => {
    const circleOfCareProvider = useCircleOfCareProvider();

    const [verificationCode, setVerificationCode] = useState('');
    const [validationError, setValidationError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateVerificationCode = (text: string) => {
        if (isLoading) return;
        setVerificationCode(text.replace(/\D/g, '').slice(0, 4));
        setValidationError('');
    }

    const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        updateVerificationCode(event.clipboardData.getData('text'));
    }

    const verify = () => {
        setValidationError('');
        if (verificationCode.length < 4) {
            setValidationError('Invalid verification code');
            return;
        }

        const verifyCode = async () => {
            setIsLoading(true);
            try {
                const didVerify = await circleOfCareProvider.verifyCircleOfCareMember(memberId, verificationCode);
                if (didVerify) {
                    goToNextPage();
                } else {
                    setValidationError('Invalid verification code');
                }
            } catch (error) {
                setValidationError('Invalid verification code');
                return;
            } finally {
                setIsLoading(false);
            }
        }
        verifyCode();
    }

    return (
        <div className="min-h-screen max-w-md flex flex-col justify-center items-center">
            <div className="p-4 space-y-4 text-center text-gray-900">
                <div className="bg-blue-100 p-4 rounded-full leading-none w-min mx-auto">
                    <Diversity1 style={{ fontSize: '60px' }} />
                </div>
                <h1 className="text-2xl font-bold ">Enter Verification Code</h1>
                <p className="text-lg ">Please, enter the code shared with you by {patientName}.</p>
                {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4" /> : <input className="w-1/2 p-2 text-center border border-gray-300 rounded-md" value={verificationCode} onChange={event => updateVerificationCode(event.target.value)} onPaste={onPaste} />}
                <p className={`text-red-500 text-sm ${!validationError ? 'invisible' : ''}`}>
                    {/* any text is added to make sure the element takes up space even if invisible */}
                    {validationError || 'a'}
                </p>
            </div>
            <button
                onClick={verify}
                disabled={isLoading}
                className="absolute bottom-0 m-4 mb-6 left-0 right-0  mt-4 glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Verify
            </button>
        </div>
    )
}

export const AllSetScreen = ({ patientName }: { patientName: string }) => {
    return (
        <div className="min-h-screen max-w-md flex flex-col justify-center items-center">
            <div className="p-4 space-y-4 text-center text-gray-900">
                <div className="bg-blue-100 p-4 rounded-full leading-none w-min mx-auto">
                    <Diversity1 style={{ fontSize: '60px' }} />
                </div>
                <h1 className="text-2xl font-bold ">All Set!</h1>
                <p className="text-lg ">Now you are a part of Circle of care.</p>
                <p className="text-base text-gray-600 ">From now on you will receive daily updates on the heart health of {patientName}.</p>
            </div>
            <Link to="/dashboard"
                className="absolute bottom-0 m-4 mb-6 left-0 right-0  mt-4 glass-button bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
                Let's get started
            </Link>
        </div>
    )
}


export const CircleOfCareOnboarding = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const userId = auth.user?.id;

    if (!userId) {  // Redirect to login if user is not authenticated
        navigate('/login');
        return null;
    }

    const [pageIndex, setPageIndex] = useState(0);

    const goToNextPage = () => {
        setPageIndex(pageIndex + 1);
    }

    const patientName = 'Elizabeth Smith';

    switch (pageIndex) {
        case 0: return <WelcomeScreen goToNextPage={goToNextPage} patientName={patientName} />;
        case 1: return <VerificationCodePage goToNextPage={goToNextPage} memberId={userId} patientName={patientName} />;
    }
    return <AllSetScreen patientName={patientName} />;
}
