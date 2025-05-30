import Joyride, { CallBackProps, EVENTS } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTutorialContext } from '../state/TutorialState';
import { useMount } from 'react-use';

export const OnboardingProvider = () => {
    const { state: { run, stepIndex, steps, tourActive }, setState: setTutorialState } = useTutorialContext();
    const navigate = useNavigate();

    useMount(() => {
        let timeout: NodeJS.Timeout;
        if (tourActive) {
            timeout = setTimeout(() => {
                setTutorialState({ run: true });
            }, 600);
        }
        return () => {
            clearTimeout(timeout);
        }
    }
    );

    useEffect(() => {
        const handleSpotlightClick = (event: MouseEvent) => {
            const currentStep = steps[stepIndex];
            if (
                currentStep.data?.proceedOnSpotlightClick && typeof currentStep.target === 'string'
            ) {
                let target = event.target as HTMLElement;
                if (target?.classList?.contains('react-joyride__spotlight')) {
                    setTutorialState({ stepIndex: stepIndex + 1 });
                }
            }
        };
        document.addEventListener('click', handleSpotlightClick);
        return () => {
            document.removeEventListener('click', handleSpotlightClick);
        };
    }, [stepIndex, steps]);

    const handleCallback = (data: CallBackProps) => {
        const {
            index,
            step,
            type,
            size
        } = data;
        console.log(data)

        if (type === EVENTS.STEP_AFTER) {
            if (index < size) {
                setTutorialState({ run: true, stepIndex: index + 1 });
                if (step.data?.next) {

                    setTutorialState({ run: false });
                    navigate(step.data.next);
                }
            } else {
                setTutorialState({ run: false, stepIndex: 0, tourActive: false });
            }
        } else if (type === EVENTS.TARGET_NOT_FOUND) {
            if (index < size) {
                setTutorialState({ stepIndex: index + 1 });
            } else {
                setTutorialState({ run: false, stepIndex: 0, tourActive: false });
            }
        } else if (type === EVENTS.TOUR_END) {
            setTutorialState({ run: false, stepIndex: 0, tourActive: false });
        }
    };

    return (
        <Joyride
            callback={handleCallback}
            continuous
            run={run}
            stepIndex={stepIndex}
            steps={steps}
            showSkipButton={true}
            hideCloseButton={true}
            hideBackButton={true}
            scrollOffset={150}
            locale={
                {
                    back: 'Back',
                    close: 'Close',
                    last: 'Got it!',
                    next: 'Got it!',
                    skip: 'Skip',
                }
            }
            styles={{
                options: {
                    arrowColor: '#fff',
                    backgroundColor: '#fff',
                    primaryColor: '#0000ff',
                    textColor: '#000',
                    zIndex: 10000,

                },
                tooltipFooter: {
                    marginTop: 0,
                }
            }}
        />
    );
};
