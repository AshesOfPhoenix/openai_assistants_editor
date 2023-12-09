'use client';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getApiKey, handleApiKeySubmit } from '@/lib/openai_api';
import { Input } from './ui/input';
import { useAssistants } from '@/app/AssistantsContext';

const OpenAIKeyButton = ({ className }: { className?: string }) => {
    const { fetchModels, fetchAssistants } = useAssistants();
    const [isEditing, setIsEditing] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null); // Placeholder for getApiKey function
    const inputRef = useRef<HTMLInputElement>(null);

    // Placeholder for getApiKey function
    // You would replace this with your actual getApiKey implementation
    useEffect(() => {
        const storedKey = getApiKey(); // Assuming 'openai_api_key' is your storage key
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    // Focus the input when editing starts
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    // Event handler for when the input loses focus
    const handleBlur = () => {
        setIsEditing(false);
        handleApiKeySubmit(apiKey ?? '');
        fetchModels();
        fetchAssistants();
        // Here you would also handle saving the API key if necessary
    };

    // Event handler for input changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
        // Here you would also handle updating the API key in local storage or state
    };

    return (
        <div
            className={cn(
                className,
                'fixed right-0 top-0 lg:static lg:max-w-[200px] lg:w-full py-4 lg:py-2 '
            )}
            onClick={() => setIsEditing(true)}
        >
            {!isEditing && (
                <div className="flex w-full h-9 p-0 justify-center items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-lg lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30 cursor-pointer">
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
                    className="flex flex-1 py-0 justify-center items-center text-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:rounded-lg lg:border lg:bg-gray-200 lg:dark:bg-zinc-800/30"
                />
            )}
        </div>
    );
};

export default OpenAIKeyButton;
