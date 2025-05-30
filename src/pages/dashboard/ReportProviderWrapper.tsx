import { useEffect, useState } from "react";
import SelectedDayContext from "./state/SelectedDayContext";
import { Outlet } from "react-router-dom";
import { useGetEarliestDate, useGetTotalDays, useLoadLatestDay, useLoadMetrics, useSelectedDayNumber, useShowWelcome } from "./dashboard_helper";
import CalendarContext from "./state/CalendarContext";
import ModalStateContext from "./state/ModalContext";
import { useDailyModalContent } from "./daily_modal_helper";
import LoadingSpinner from "../../common/presentation/components/LoadingSpinner";
import { TutorialProvider } from "../../features/onboarding/presentation/state/TutorialState";

const ReportProviderWrapper = () => {

    const totalDays = useGetTotalDays() || 0;
    const { latestDate, latestDateError } = useLoadLatestDay();
    const { earliestDate } = useGetEarliestDate();


    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    useEffect(() => {
        if (!selectedDate && latestDate) {
            setSelectedDate(latestDate);
        }
    }, [latestDate]);

    const { showWelcome, setShowWelcome } = useShowWelcome(totalDays);

    const [showDayModal, setShowDayModal] = useState(false);
    const dayModalContent = useDailyModalContent(totalDays);

    useEffect(() => {
        if (dayModalContent) {
            setShowDayModal(true);
        }
    }, [JSON.stringify(dayModalContent)]);

    const { report: metrics, metricsLoading } = useLoadMetrics(selectedDate);

    const selectedDayNumber = useSelectedDayNumber(selectedDate);

    if (!selectedDate) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <LoadingSpinner title="Initializing..." />
            </div>
        );
    }


    return (
        <TutorialProvider>
            <CalendarContext.Provider value={{
                totalDays,
                latestDate: latestDate || selectedDate!,
                earliestDate: earliestDate || selectedDate!,
            }}>
                <ModalStateContext.Provider value={{
                    dayModalContent,
                    showWelcomeModal: showWelcome,
                    setShowWelcomeModal: setShowWelcome,
                    showDayModal,
                    setShowDayModal,
                }}>
                    <SelectedDayContext.Provider value={{
                        selectedDate: selectedDate!,
                        setSelectedDate,
                        report: metrics,
                        isLoading: metricsLoading,
                        error: latestDateError,
                        selectedDayNumber,
                    }}>
                        <main >
                            <Outlet />
                        </main>

                    </SelectedDayContext.Provider>
                </ModalStateContext.Provider>
            </CalendarContext.Provider>
        </TutorialProvider>
    )
}

export default ReportProviderWrapper;



