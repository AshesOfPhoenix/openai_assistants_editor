import React from 'react';
import AssistantsContainer from '@/components/assistants/AssistantsContainer';
import ChatContainer from '@/components/chat/ChatContainer';
import { LightningBoltIcon } from '@radix-ui/react-icons';

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-start h-full max-w-full flex-1">
            <div role="presentation" className="flex flex-col h-full">
                <div className="z-10 w-full items-center justify-between font-mono text-sm mb-2 lg:flex lg:my-3">
                    <p className="fixed left-0 top-0 flex w-full justify-center lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 hover:shadow-md items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-lg lg:border lg:bg-gray-200 py-4 lg:px-4 lg:py-2 lg:dark:bg-zinc-800/30">
                        GPT-4 Inside{' '}
                        <LightningBoltIcon
                            className="ml-2 text-yellow-500"
                            width={20}
                            height={20}
                        />
                    </p>
                    <p className="fixed left-0 top-0 flex w-full justify-center lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 hover:shadow-md items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-lg lg:border lg:bg-gray-200 py-4 lg:px-4 lg:py-2 lg:dark:bg-zinc-800/30">
                        Enter your API key to plug in
                    </p>
                </div>
                <div className="z-0 flex flex-col items-center justify-start w-full h-full">
                    <div className="flex flex-1 flex-col lg:flex-row justify-center items-center lg:items-start w-full space-x-4 space-y-4 lg:space-y-0">
                        <AssistantsContainer />
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </main>
    );
}
