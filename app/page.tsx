import React from 'react';
import AssistantsContainer from '@/components/assistants/AssistantsContainer';
import ChatContainer from '@/components/chat/ChatContainer';
import OpenAIKeyButton from '@/components/OpenAIKeyButton';
import { GPT4 } from '@/components/GPT4';

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col items-center justify-start h-full max-w-full flex-1">
            <div role="presentation" className="flex flex-col h-full">
                <div className="z-10 w-full flex items-center justify-between font-mono text-sm lg:flex">
                    <GPT4 />
                    <OpenAIKeyButton />
                </div>
                <div className="z-[1] flex flex-col items-center justify-start w-full h-full overflow-hidden">
                    <div className="flex flex-1 flex-col max-h-full mb-12 lg:flex-row justify-center items-center lg:items-start w-full space-x-4 space-y-4 lg:space-y-0">
                        <AssistantsContainer />
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </main>
    );
}
