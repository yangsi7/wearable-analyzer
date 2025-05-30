import { createContext, useContext, useMemo } from 'react';
import { Step } from 'react-joyride';
import { useSetState } from 'react-use';

interface TutorialState {
    run: boolean;
    stepIndex: number;
    steps: Step[];
    tourActive: boolean;
}

const initialTutorialState = {
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
};

export const TutorialContext = createContext({
    state: initialTutorialState,
    setState: () => undefined,
});
TutorialContext.displayName = 'TutorialContext';

export function TutorialProvider(props: any) {
    const [state, setState] = useSetState(initialTutorialState);

    const value = useMemo(
        () => ({
            state,
            setState,
        }),
        [setState, state],
    );

    return <TutorialContext.Provider value={value} {...props} />;
}

export function useTutorialContext(): {
    setState: (patch: Partial<TutorialState> | ((previousState: TutorialState) => Partial<TutorialState>)) => void;
    state: TutorialState;
} {
    const context = useContext(TutorialContext);

    if (!context) {
        throw new Error('useTutorialContext must be used within a TutorialProvider');
    }

    return context;
}
