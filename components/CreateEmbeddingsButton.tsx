'use client';
import React from 'react';
import { Button } from './ui/button';
import { CheckIcon, UpdateIcon } from '@radix-ui/react-icons';

const CreateEmbeddingsButton = () => {
    const [embeddsFetched, setEmbeddsFetched] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/embeddings', {
                method: 'POST',
            });
            const data = await response.json();
            console.log(data);
            setEmbeddsFetched(true);
        } catch (error) {
            // Handle any errors that occur during the API call
        }
        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleClick}
            className="bg-primary hover:outline hover:outline-yellow-500 hover:outline-[0.1px] hover:shadow-lg w-40"
        >
            {!embeddsFetched ? (
                !isLoading ? (
                    <span>Create Embeddings</span>
                ) : (
                    <UpdateIcon className="animate-spin" />
                )
            ) : (
                <span className="flex flex-row items-center">
                    Uploaded. <CheckIcon width={20} height={20} />
                </span>
            )}
        </Button>
    );
};

export default CreateEmbeddingsButton;
