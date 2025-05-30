import HeartRateDetails from './pages/details/HeartRateDetails.tsx';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import ReportProviderWrapper from './pages/dashboard/ReportProviderWrapper.tsx';
import PauseDetails from './pages/details/PauseDetails.tsx';
import AvBlockDetails from './pages/details/AVBlockDetails.tsx';
import AfibDetails from './pages/details/AfibDetails.tsx';
import { DetailsWrapper } from './pages/details/DetailsWrapper.tsx';
import { ChatPage } from './chat/presentation/ChatPage.tsx';
import { LoginPage } from './features/auth/presentation/LoginPage.tsx';
import { ForgotPasswordPage } from './features/auth/presentation/ForgotPasswordPage.tsx';
import { SignUpPage } from './features/auth/presentation/SignUpPage.tsx';
import { AuthLayout } from './features/auth/presentation/components/AuthLayout.tsx';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ReportRepository from './features/report/domain/repositories/report_repository.ts';
import { DailyReportProvider } from './features/report/presentation/providers/DailyReportProvider.tsx';
import { SettingsPage } from './features/settings/presentation/SettingsPage.tsx';
import { CircleOfCareRepository } from './features/circle_of_care/domain/repositories/circle_of_care_repository.ts';
import { CircleOfCareProvider } from './features/circle_of_care/presentation/CircleOfCareProvider.tsx';
import { SummaryPage } from './features/report/presentation/SummaryPage.tsx';
import { CircleOfCareOnboarding } from './features/circle_of_care/presentation/CircleOfCareOnboarding.tsx';

interface RouterProps {
    reportRepository: ReportRepository;
    circleOfCareRepository: CircleOfCareRepository;
}

export const createAppRouter = ({ reportRepository, circleOfCareRepository }: RouterProps) => createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "*", element: <Navigate to="/dashboard" replace /> },
    {
        path: "/dashboard",
        element: (<AuthLayout>
            <DailyReportProvider reportRepository={reportRepository} >
                <CircleOfCareProvider circleOfCareRepository={circleOfCareRepository}>
                    <ReportProviderWrapper />
                </CircleOfCareProvider>
            </DailyReportProvider>
        </AuthLayout>),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                element: <DetailsWrapper />, children: [
                    {
                        path: 'heart-rate',
                        element: <HeartRateDetails />
                    },
                    {
                        path: 'afib',
                        element: <AfibDetails />
                    },
                    {
                        path: 'pauses',
                        element: <PauseDetails />
                    },
                    {
                        path: 'av-blocks',
                        element: <AvBlockDetails />
                    },

                ]
            },
            {
                path: "chat",
                element: <ChatPage />
            },
            {
                path: "settings",
                element: <SettingsPage />
            },
            {
                path: "summary",
                element: <SummaryPage />
            }
        ]
    },
    {
        path: "/circle-of-care",
        children: [
            {
                index: true,
                element: <Navigate to="onboarding" replace />
            },
            {
                path: "onboarding",
                element: <CircleOfCareProvider circleOfCareRepository={circleOfCareRepository}>
                    <CircleOfCareOnboarding />
                </CircleOfCareProvider>
            }
        ]
    }

],
);