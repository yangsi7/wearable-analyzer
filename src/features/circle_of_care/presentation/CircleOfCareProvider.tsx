import React, {
    createContext,
    useContext
} from 'react';
import { CircleOfCareRepository } from '../domain/repositories/circle_of_care_repository';

const CircleOfCareContext = createContext<CircleOfCareRepository | undefined>(undefined);

export const CircleOfCareProvider: React.FC<{
    children: React.ReactNode,
    circleOfCareRepository: CircleOfCareRepository
}> = ({ children, circleOfCareRepository: circleOfCareRepository }) => {
    return (
        <CircleOfCareContext.Provider value={circleOfCareRepository}>
            {children}
        </CircleOfCareContext.Provider>
    );
};

export const useCircleOfCareProvider = () => {
    const context = useContext(CircleOfCareContext);
    if (context === undefined) {
        throw new Error('useCircleOfCareProvider must be used within an CircleOfCareProvider');
    }
    return context;
};