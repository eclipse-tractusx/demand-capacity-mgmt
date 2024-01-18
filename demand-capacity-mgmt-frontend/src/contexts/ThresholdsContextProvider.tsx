import React, { createContext, useState, useEffect } from 'react';
import { ThresholdProp } from '../interfaces/Threshold_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from "./UserContext";

interface ThresholdsContextData {
    thresholds: ThresholdProp[];
    enabledThresholds: ThresholdProp[];
    fetchThresholds: () => Promise<void>;
    updateThresholds: (ruleRequests: RuleRequest[]) => Promise<void>;
}

interface RuleRequest {
    id: number;
    enabled: boolean;
}

export const ThresholdsContext = createContext<ThresholdsContextData | undefined>(undefined);

const ThresholdContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const { access_token } = useUser();
    const [thresholds, setThresholds] = useState<ThresholdProp[]>([]);
    const [enabledThresholds, setEnabledThresholds] = useState<ThresholdProp[]>([]);

    const fetchThresholds = async () => {
        const api = createAPIInstance(access_token);
        try {
            const response = await api.get('/rules/');
            setThresholds(response.data);
            const enabledResponse = await api.get('/rules/enabled');
            setEnabledThresholds(enabledResponse.data);
        } catch (error) {
            console.error('Error fetching thresholds:', error);
        }
    };

    const updateThresholds = async (ruleRequests: RuleRequest[]) => {
        const api = createAPIInstance(access_token);
        try {
            await api.put('/rules/', ruleRequests);
            fetchThresholds(); // Refetch thresholds and enabled thresholds
        } catch (error) {
            console.error('Error updating thresholds:', error);
        }
    };

    useEffect(() => {
        fetchThresholds();
    }, [access_token]);

    return (
        <ThresholdsContext.Provider value={{ thresholds, enabledThresholds, fetchThresholds, updateThresholds }}>
            {children}
        </ThresholdsContext.Provider>
    );
};

export default ThresholdContextProvider;