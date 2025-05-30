import { Heart } from "lucide-react"
import { LogoutButton } from "../../../features/auth/presentation/components/LogoutButton";
import { Link } from "react-router-dom";
import { HelpOutline, Settings } from "@mui/icons-material";
import { useTutorialContext } from "../../../features/onboarding/presentation/state/TutorialState";
import { dashboardOnboardingSteps } from "../../../features/onboarding/presentation/OnboardingSteps";

const DashboardHeader = () => {
    const { setState: setTutorialState } = useTutorialContext();
    const startTutorial = () => {
        setTutorialState({
            run: true,
            stepIndex: 0,
            tourActive: true,
            steps: dashboardOnboardingSteps,
        });
    }
    return <header className="sticky top-0 bg-white shadow-sm z-20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                    Heart Health Dashboard
                </h1>
            </div>

            <div className="flex gap-2 items-center">
                <LogoutButton />
                <Link
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                    aria-label="Settings"
                    to={"/dashboard/settings"}
                >
                    <Settings />
                </Link>
                <div className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100" onClick={startTutorial}>
                    <HelpOutline />
                </div>
            </div>

        </div>
    </header>
}

export default DashboardHeader;