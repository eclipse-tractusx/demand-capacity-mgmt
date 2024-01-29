import React, { createContext, useEffect, useState } from 'react';
import { ThresholdProp } from '../interfaces/Threshold_interfaces';
import createAPIInstance from "../util/Api";
import { useUser } from "./UserContext";

interface ThresholdsContextData {
    thresholds: ThresholdProp[];
    enabledThresholds: ThresholdProp[];
    fetchThresholds: () => Promise<void>;
    updateThresholds: (ruleRequests: RuleRequest[]) => Promise<void>;
    updateCGThresholds: (cgRequest: CGRequest) => Promise<void>;
    updateCompanyThresholds: (companyRequest: CompanyRequest) => Promise<void>;
    addNewThreshold: (requestBody: { percentage: number }) => Promise<void>;
    deleteThresholds: (ruleRequests: RuleRequest[]) => Promise<void>;

}

export interface RuleRequest {
    id: number;
    enabled: boolean;
}

interface CGRequest {
    cgID: string;
    percentages: string;
}

interface CompanyRequest {
    companyID: string;
    percentages: string;
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
            fetchThresholds();
        } catch (error) {
            console.error('Error updating thresholds:', error);
        }
    };

    const deleteThresholds = async (ruleRequests: RuleRequest[]) => {
        const api = createAPIInstance(access_token);
        try {
            await api.delete('/rules/', { data: ruleRequests });
            fetchThresholds();
        } catch (error) {
            console.error('Error updating thresholds:', error);
        }
    };


    const updateCGThresholds = async (cgRequest: CGRequest) => {
        const api = createAPIInstance(access_token);
        try {
            await api.post('cg/ruleset', cgRequest);
            fetchThresholds();
        } catch (error) {
            console.error('Error updating CG thresholds:', error);
        }
    };

    const updateCompanyThresholds = async (companyRequest: CompanyRequest) => {
        const api = createAPIInstance(access_token);
        try {
            await api.post('cd/ruleset', companyRequest);
            fetchThresholds();
        } catch (error) {
            console.error('Error updating company thresholds:', error);
        }
    };

    const addNewThreshold = async (requestBody: { percentage: number }) => {
        const api = createAPIInstance(access_token);
        try {
            // Send the requestBody to the server
            await api.post('/rules/', requestBody);
            fetchThresholds();
        } catch (error) {
            console.error('Error adding new threshold:', error);
        }
    };

    useEffect(() => {
        fetchThresholds();
    }, [access_token]);

    return (
        <ThresholdsContext.Provider value={{ thresholds, enabledThresholds, fetchThresholds, updateThresholds, updateCGThresholds, updateCompanyThresholds, addNewThreshold, deleteThresholds }}>
            {children}
        </ThresholdsContext.Provider>
    );
};

export default ThresholdContextProvider;