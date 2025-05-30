import { InfoOutlined } from "@mui/icons-material";
import { Step } from "react-joyride";

export const dashboardOnboardingSteps: Array<Step> = [
    {
        target: 'body',
        title: <p className='font-bold'>Welcome to your dashboard!</p>,
        content: (
            <>
                <p>Here you can view your heart health metrics and logged symptoms.</p>
            </>
        ),
        disableBeacon: true,
        placement: 'center',
    },
    {
        target: '#insightsCard',
        title: <p className='font-bold'>Insights</p>,
        content: (
            <div className='space-y-2 text-left'>
                <p className='text-left'>Each day we provide personalized insights about your heart health.</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        target: '#showDetailsButton',
        title: <p className='font-bold'>Insights</p>,
        content: (
            <div className='space-y-2 text-left'>
                <div className='bg-blue-300/10 text-blue-600 rounded-md flex gap-2 items-center p-2'>
                    <InfoOutlined />
                    <p>Tap on "Show details" button to get more insights.</p>
                </div>
            </div>
        ),
        disableBeacon: true,
        hideFooter: true,
        spotlightClicks: true,
        data: {
            proceedOnSpotlightClick: true,
        },
        disableOverlayClose: true,
    },
    {
        title: <p className='font-bold'>Metric cards</p>,
        target: '#heartRateCard',
        content: (
            <div className='space-y-2 text-left'>
                <p>Let's look at the Heart rate metric card.</p>
                <p>This one shows your average heart rate during the monitoring.</p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        title: <p className='font-bold'>Metric status</p>,
        target: '#rangeIndicator',
        content: (
            <>
                <p className='text-left'>This indicator shows the status of a metric compared to historical data.</p>
            </>
        ),
        disableBeacon: true,
        placement: 'left',
    },
    {
        title: <p className='font-bold'>Metric status</p>,
        target: '#statusDescription',
        content: (
            <>
                <p className='text-left'>
                    You can also read the description of a metric's status at the bottom of the card.
                </p>
            </>
        ),
        disableBeacon: true,
    },
    {
        title: <p className='font-bold'>Detailed view</p>,
        target: '#heartRateCard',
        content: (
            <div className='space-y-2 text-left'>
                <p>Let's take a closer look at the heart rate metric.</p>
                <div className='bg-blue-300/10 text-blue-600 rounded-md flex gap-2 items-center p-2'>
                    <InfoOutlined />
                    <p>Tap on the card to go to a detailed view.</p>
                </div>
            </div>
        ),
        disableBeacon: true,
        disableOverlayClose: true,
        hideCloseButton: true,
        hideFooter: true,
        placement: 'bottom',
        data: {
            next: '/dashboard/heart-rate',
            proceedOnSpotlightClick: true,
        }
    },
    {
        target: 'body',
        title: <p className='font-bold'>Welcome to the detailed view!</p>,
        content: (
            <>
                <p>Here you can see the detailed information regarding the metric.</p>
            </>
        ),
        disableBeacon: true,
        placement: 'center',
    },
    {
        title: <p className='font-bold'>Metric details</p>,
        target: '#heartRateCard',
        content: (
            <>
                <p className='text-left'>In this view, the metric card contains additional information about the metric.</p>
            </>
        ),
        disableBeacon: true,
        placement: 'left',
    },
    {
        title: <p className='font-bold'>Baseline</p>,
        target: '#baselineCard',
        content: (
            <div className='space-y-2 text-left'>
                <p className='text-left'>
                    You can also see the normal range of the metric.
                </p>
                <p className='text-left'>
                    The normal range is based on your historical data. This can change over time.
                </p>
            </div>
        ),
        disableBeacon: true,
    },
    {
        title: <p className='font-bold'>Metric history</p>,
        target: '#chart',
        content: (
            <div className='space-y-2 text-left'>
                <p>With the help of the graphs you can view how your metric changed over a period of time</p>
                <p> Pro tip: you can select the periods duration at the top of the graph.</p>
            </div>
        ),
        disableOverlayClose: true,
        spotlightClicks: true,
        data: {
            proceedOnSpotlightClick: false,
        }
    },
    {
        title: <p className='font-bold'>Detailed view</p>,
        target: 'body',
        content: (
            <div className='space-y-2 text-left'>
                <p>That's it for the detailed view.</p>
                <p>Consult this view, when you need more information about your metrics.</p>
            </div>
        ),
        placement: 'center'
    },
    {
        target: '#backButton',
        title: <p className='font-bold'>Back to dashboard</p>,
        content: (
            <div className='space-y-2 text-left'>
                <p>Let's go back to the dashboard.</p>
                <div className='bg-blue-300/10 text-blue-600 rounded-md flex gap-2 items-center p-2'>
                    <InfoOutlined />
                    <p>Tap on the back button to return to dashboard.</p>
                </div>
            </div>
        ),
        hideFooter: true,
        data: {
            proceedOnSpotlightClick: true,
            next: '/dashboard',
        }
    },
    {
        target: '#backButton',
        title: <p className='font-bold'>Back to dashboard</p>,
        content: (
            <div className='space-y-2 text-left'>
                <p>Let's go back to the dashboard.</p>
                <div className='bg-blue-300/10 text-blue-600 rounded-md flex gap-2 items-center p-2'>
                    <InfoOutlined />
                    <p>Tap on the back button to return to dashboard.</p>
                </div>
            </div>
        ),
        hideFooter: true,
        data: {
            proceedOnSpotlightClick: true,
            next: '/dashboard',
        }
    },
    {
        target: '#symptomList',
        title: <p className='font-bold'>Symptoms log</p>,
        content: (
            <div className='space-y-2 text-left'>
                <p>Here you can see the symptoms you have logged.</p>
            </div>
        ),
    },
    {
        target: 'body',
        title: <p className='font-bold'>That's it!</p>,
        content: (
            <>
                <p>Explore your dashboard and keep track of you heart health.</p>
            </>
        ),
        placement: 'center',
    }
];
