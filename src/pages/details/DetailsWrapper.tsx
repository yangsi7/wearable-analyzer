import { Outlet, useNavigate } from "react-router-dom";
import ErrorMessage from "../dashboard/components/ErrorMessage";
import { useSelectedDay } from "../dashboard/state/SelectedDayContext";
import { formatDate } from "../../utils/date_utils";
import LoadingSpinner from "../../common/presentation/components/LoadingSpinner";
import { Header } from "../../common/presentation/components/Header";
import { useMount } from "react-use";
import { OnboardingProvider } from "../../features/onboarding/presentation/screens/OnboardingProvider";

export const DetailsWrapper = () => {
    useMount(() => {
        window.scrollTo(0, 0)
    });

    const { error, isLoading, selectedDate } = useSelectedDay();
    const navigate = useNavigate();
    return <>
        <Header title={formatDate(selectedDate)} onBackClick={() => navigate(-1)} />

        {error
            ? <ErrorMessage error={error} />
            : isLoading ? (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <LoadingSpinner title="Loading your heart health data..." />
                </div>
            )
                :
                <div className="min-h-screen bg-gray-100 max-w-md mx-auto px-4 py-6">
                    <Outlet />
                    <OnboardingProvider />
                </div>

        }

    </>
}


