import { DailyModal } from "./components/DailyModal";
// import { TrendsScreen } from "../trends/TrendsScreen";
import { DaySelector } from "./components/DaySelector";
import { EducationCard } from "./components/EducationCard";
import MetricsSection from "./sections/MetricsSection";
import { educationalContent } from "../../data/dailyContent";
import { WelcomeModal } from "./components/WelcomeModal";
import { SymptomList } from "./sections/SymptomList";
import { useSelectedDay } from "./state/SelectedDayContext";
import DashboardHeader from "./sections/DashboardHeader";
import ErrorMessage from "./components/ErrorMessage";
import { useCalendar } from "./state/CalendarContext";
import { useModalState } from "./state/ModalContext";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../common/presentation/components/LoadingSpinner";
import { InsightsCard } from "./components/InsightsCard";
import { OnboardingProvider } from "../../features/onboarding/presentation/screens/OnboardingProvider";
import { useEffect } from "react";
import { DataQualityCard } from "./components/DataQualityCard";



function Dashboard() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { totalDays, latestDate, earliestDate } = useCalendar();
    const { report: metrics, setSelectedDate, selectedDayNumber, selectedDate, error, isLoading } = useSelectedDay();
    const { showWelcomeModal, setShowWelcomeModal, showDayModal, setShowDayModal, dayModalContent } = useModalState();

    return (
        <>
            <DashboardHeader />

            {
                error
                    ? <ErrorMessage error={error} />
                    : isLoading ? (
                        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                            <LoadingSpinner title="Loading your heart health data..." />
                        </div>
                    )
                        :
                        <>

                            <div className="min-h-screen bg-gray-100 max-w-md mx-auto px-4 py-6">
                                {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
                                {/* Only show welcome animation for new users */}
                                {/* {totalDays && totalDays <= 1 && (
                            <div className={`transition-opacity duration-500 ${showWelcomeAnimation ? 'opacity-100' : 'opacity-0'
                                }`}>
                                <div className="text-center mb-6 text-blue-600">
                                    <p className="text-sm font-medium">Start your heart health journey</p>
                                    <div className="mt-2 animate-bounce">
                                        <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )} */}
                                {(showDayModal && !showWelcomeModal) && <DailyModal
                                    onClose={() => setShowDayModal(false)}
                                    content={dayModalContent}
                                />}


                                <div className="space-y-6">
                                    <DaySelector
                                        selectedDate={selectedDate}
                                        onDateChange={(date) => setSelectedDate(date)}
                                        maximumDate={latestDate}
                                        minimumDate={earliestDate}
                                    />
                                    {metrics?.dataQualityInfo && <DataQualityCard {...metrics.dataQualityInfo} />}
                                    {metrics?.insights && <InsightsCard insights={metrics.insights} />}
                                    <MetricsSection metrics={metrics} currentDay={selectedDayNumber} />
                                    <EducationCard content={totalDays ? educationalContent[totalDays] : undefined} />
                                    <section className="mt-8">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Symptoms Log
                                        </h2>
                                        <SymptomList symptomLogs={metrics?.loggedSymptoms || []} />
                                    </section>
                                </div>


                                {/* Floating Action Button */}
                                <div
                                    className="fixed right-6 bottom-6 z-40 flex flex-col items-end space-y-4 pointer-events-auto"
                                    role="region"
                                    aria-label="Quick actions menu"
                                >


                                    {/* Chat Button */}
                                    <Link to={"/dashboard/chat"}
                                        className="flex items-center gap-2 p-3 text-white/95 backdrop-blur-sm bg-purple-400 rounded-full md-elevation-2 hover:bg-purple-600 hover:md-elevation-3 transform hover:scale-105 transition-all duration-300"
                                        aria-label="Start CardioAI chat"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                    </Link>


                                </div>
                            </div>
                            <OnboardingProvider />
                        </>
            }
        </>
    );
}

export default Dashboard;