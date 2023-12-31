'use client'
import { useAssistants } from '@/app/AssistantsContext'
import { getApiKey, handleApiKeySubmit } from '@/lib/openai_api'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'

/**
 * Renders a button component for managing OpenAI API key.
 *
 * @param {string} className - Optional CSS class for the button component.
 * @return {JSX.Element} The rendered button component.
 */
const OpenAIKeyButton = ({ className }: { className?: string }) => {
    const { fetchModels, fetchAssistants } = useAssistants()
    const [isEditing, setIsEditing] = useState(false)
    const [apiKey, setApiKey] = useState<string | null>(null) // Placeholder for getApiKey function
    const inputRef = useRef<HTMLInputElement>(null)

    // Placeholder for getApiKey function
    // You would replace this with your actual getApiKey implementation
    useEffect(() => {
        const storedKey = getApiKey() // Assuming 'openai_api_key' is your storage key
        if (storedKey) {
            setApiKey(storedKey)
        }
    }, [])

    // Focus the input when editing starts
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus()
        }
    }, [isEditing])

    // Event handler for when the input loses focus
    const handleBlur = () => {
        setIsEditing(false)
        handleApiKeySubmit(apiKey ?? '')
        fetchModels()
        fetchAssistants()
        // Here you would also handle saving the API key if necessary
    }

    // Event handler for input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value)
        // Here you would also handle updating the API key in local storage or state
    }

    return (
        <div
            className={cn(
                className,
                'fixed right-0 top-0 py-4 lg:static lg:py-2',
                `lg:w-full lg:max-w-[200px]`
            )}
            onClick={() => setIsEditing(true)}
        >
            {!isEditing && (
                <div
                    className={cn(
                        `flex h-9 w-full cursor-pointer items-center justify-center border-b`,
                        `lg:rounded-lg lg:border`,
                        `border-gray-300 bg-gradient-to-b from-zinc-200 p-0 backdrop-blur-2xl lg:bg-gray-200`,
                        `dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30`,
                        `hover:shadow-md lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200`
                    )}
                >
                    {apiKey ? 'Change API key' : 'Enter API Key'}
                </div>
            )}
            {isEditing && (
                <Input
                    ref={inputRef}
                    type="text"
                    value={apiKey || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                        `flex flex-1 items-center justify-center text-center`,
                        `border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-0 backdrop-blur-2xl lg:rounded-lg lg:border lg:bg-gray-200`,
                        `dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:dark:bg-zinc-800/30`,
                        `hover:shadow-md lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200`
                    )}
                />
            )}
        </div>
    )
}

export default OpenAIKeyButton
