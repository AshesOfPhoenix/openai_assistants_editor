'use client';

import { getApiKey } from '@/lib/openai_api';
import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';

type AssistantsContext = {
    assistants: [Assistant] | undefined;
    setAssistants: React.Dispatch<React.SetStateAction<[Assistant] | undefined>>;
    fetchAssistants: () => Promise<void>;
    fetchModels: () => Promise<void>;
    activeAssistant: Assistant | undefined;
    setActiveAssistant: React.Dispatch<React.SetStateAction<Assistant | undefined>>;
    modelsList: Model[];
};

const Context = createContext<AssistantsContext>({
    assistants: undefined,
    setAssistants: () => {},
    fetchAssistants: async () => {},
    fetchModels: async () => {},
    activeAssistant: undefined,
    setActiveAssistant: () => {},
    modelsList: [],
});

export default function AssistantsProvider({ children }: { children: React.ReactNode }) {
    const [assistants, setAssistants] = useState<[Assistant]>();
    const [isFetching, setIsFetching] = useState(false);
    const [activeAssistant, setActiveAssistant] = React.useState<Assistant>();
    const [modelsList, setModelsList] = React.useState<Model[]>([]);

    const fetchAssistants = async () => {
        setIsFetching(true);
        try {
            const apiKey = getApiKey();

            const config = {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            };

            const response = await axios.post('/api/assistant/list', {}, config);

            const data = await response.data;
            setAssistants(data as [Assistant]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchModels = async () => {
        setIsFetching(true);
        try {
            const apiKey = getApiKey();

            const config = {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            };

            const response = await axios.post('/api/models', {}, config);

            const data = await response.data;
            console.log('Models => ', data);
            let models = data
                .filter((assistant: any) => assistant.id.startsWith('gpt'))
                .filter(
                    (assistant: any) =>
                        assistant.owned_by === 'openai' || assistant.owned_by === 'system'
                );
            models = models.sort((a: any, b: any) => (a.created < b.created ? 1 : -1));
            setModelsList(models as [Model]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchAssistants();
        fetchModels();
    }, []);

    return (
        <Context.Provider
            value={{
                assistants,
                setAssistants,
                fetchAssistants,
                fetchModels,
                activeAssistant,
                setActiveAssistant,
                modelsList,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useAssistants = () => {
    const context = React.useContext(Context);

    if (!context) {
        throw new Error('useAssistants must be used within an AssistantsProvider');
    }

    return context;
};
