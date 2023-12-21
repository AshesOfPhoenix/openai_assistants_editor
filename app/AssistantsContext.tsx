'use client'

import { makeOpenAiApiRequest } from '@/lib/openai_api'
import React, { createContext, useEffect, useState } from 'react'

type AssistantsContext = {
    assistants: [AssistantCustom] | undefined
    setAssistants: React.Dispatch<
        React.SetStateAction<[AssistantCustom] | undefined>
    >
    fetchAssistants: () => Promise<void>
    fetchModels: () => Promise<void>
    activeAssistant: AssistantCustom | undefined
    setActiveAssistant: React.Dispatch<
        React.SetStateAction<AssistantCustom | undefined>
    >
    modelsList: Model[]
    isFetchingAssistants: boolean
}

const Context = createContext<AssistantsContext>({
    assistants: undefined,
    setAssistants: () => {},
    fetchAssistants: async () => {},
    fetchModels: async () => {},
    activeAssistant: undefined,
    setActiveAssistant: () => {},
    modelsList: [],
    isFetchingAssistants: false,
})

export default function AssistantsProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [assistants, setAssistants] = useState<[AssistantCustom]>()
    const [isFetchingAssistants, setIsFetchingAssistants] = useState(false)
    const [activeAssistant, setActiveAssistant] =
        React.useState<AssistantCustom>()
    const [modelsList, setModelsList] = React.useState<Model[]>([])

    const fetchAssistants = async () => {
        setIsFetchingAssistants(true)
        try {
            const response = await makeOpenAiApiRequest(
                '/api/assistant/list',
                {}
            )
            const data = await response
            setAssistants(data as [AssistantCustom])
        } catch (error) {
            console.error(error)
        } finally {
            setIsFetchingAssistants(false)
        }
    }

    const fetchModels = async () => {
        setIsFetchingAssistants(true)
        try {
            const response = await makeOpenAiApiRequest('/api/models', {})
            const data = await response
            console.log('Models => ', data)
            let models = data
                .filter((assistant: any) => assistant.id.startsWith('gpt'))
                .filter(
                    (assistant: any) =>
                        assistant.owned_by === 'openai' ||
                        assistant.owned_by === 'system'
                )
            models = models.sort((a: any, b: any) =>
                a.created < b.created ? 1 : -1
            )
            setModelsList(models as [Model])
        } catch (error) {
            console.error(error)
        } finally {
            setIsFetchingAssistants(false)
        }
    }

    useEffect(() => {
        fetchAssistants()
        fetchModels()
    }, [])

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
                isFetchingAssistants,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useAssistants = () => {
    const context = React.useContext(Context)

    if (!context) {
        throw new Error(
            'useAssistants must be used within an AssistantsProvider'
        )
    }

    return context
}
