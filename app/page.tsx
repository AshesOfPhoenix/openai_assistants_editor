import { GPT4 } from '@/components/GPT4'
import OpenAIKeyButton from '@/components/OpenAIKeyButton'
import AssistantsContainer from '@/components/assistants/AssistantsContainer'
import ChatContainer from '@/components/chat/ChatContainer'
import { cn } from '@/lib/utils'

export default function Home() {
    return (
        <main
            className={cn(
                `relative flex flex-col items-center justify-start`,
                `h-full min-h-screen max-w-full flex-1`
            )}
        >
            <div role="presentation" className="flex h-full flex-col">
                <div className="z-10 flex w-full items-center justify-between font-mono text-sm lg:flex">
                    <GPT4 />
                    <OpenAIKeyButton />
                </div>
                <div
                    className={cn(
                        `z-[1] flex h-full w-full flex-col items-center justify-start overflow-hidden`
                    )}
                >
                    <div
                        className={cn(
                            `flex flex-1 flex-col items-center justify-center lg:flex-row lg:items-start`,
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
    )
}
