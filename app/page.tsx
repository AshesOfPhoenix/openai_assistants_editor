import React from 'react';
import AssistantsContainer from '@/components/assistants/AssistantsContainer';
import ChatContainer from '@/components/chat/ChatContainer';
import OpenAIKeyButton from '@/components/OpenAIKeyButton';
import { GPT4 } from '@/components/GPT4';
import { cn } from '@/lib/utils';

export default function Home() {
    return (
        <main
            className={cn(
                `relative flex flex-col items-center justify-start`,
                `h-full min-h-screen max-w-full flex-1`
            )}
        >
            <div role="presentation" className="flex flex-col h-full">
                <div className="z-10 flex items-center justify-between w-full font-mono text-sm lg:flex">
                    <GPT4 />
                    <OpenAIKeyButton />
                </div>
                <div
                    className={cn(
                        `flex flex-col items-center justify-start w-full h-full z-[1] overflow-hidden`
                    )}
                >
                    <div
                        className={cn(
                            `flex flex-1 flex-col lg:flex-row justify-center items-center lg:items-start`,
                            `max-h-full w-full`,
                            `mb-12 space-x-4 space-y-4 lg:space-y-0`
                        )}
                    >
                        <AssistantsContainer />
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </main>
    );
}
