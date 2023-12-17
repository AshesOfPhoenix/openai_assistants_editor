import React from 'react'
import AssistantsContainer from '@/components/assistants/AssistantsContainer'
import ChatContainer from '@/components/chat/ChatContainer'
import { LightningBoltIcon } from '@radix-ui/react-icons'

export default function Home() {
    return (
        <main className="relative flex h-full min-h-screen max-w-full flex-1 flex-col items-center justify-start">
            <div role="presentation" className="flex h-full flex-col">
                <div className="z-10 mb-2 w-full items-center justify-between font-mono text-sm lg:my-3 lg:flex">
                    <p className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-4 backdrop-blur-2xl hover:shadow-md dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-lg lg:border lg:bg-gray-200 lg:px-4 lg:py-2 lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 lg:dark:bg-zinc-800/30">
                        GPT-4 Inside{' '}
                        <LightningBoltIcon
                            className="ml-2 text-yellow-500"
                            width={20}
                            height={20}
                        />
                    </p>
                    <p className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 py-4 backdrop-blur-2xl hover:shadow-md dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-lg lg:border lg:bg-gray-200 lg:px-4 lg:py-2 lg:hover:outline lg:hover:outline-[0.1px] lg:hover:outline-zinc-200 lg:dark:bg-zinc-800/30">
                        Enter your API key to plug in
                    </p>
                </div>
                <div className="z-0 flex h-full w-full flex-col items-center justify-start">
                    <div className="flex w-full flex-1 flex-col items-center justify-center space-x-4 space-y-4 lg:flex-row lg:items-start lg:space-y-0">
                        <AssistantsContainer />
                        <ChatContainer />
                    </div>
                </div>
            </div>
        </main>
    )
}
