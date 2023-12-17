'use client'
import { useAssistants } from '@/app/AssistantsContext'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { makeOpenAiApiRequest } from '@/lib/openai_api'
import { ResumeIcon, UpdateIcon } from '@radix-ui/react-icons'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const ChatContainer = () => {
    const { assistants, activeAssistant } = useAssistants()
    const [question, setQuestion] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [activeThread, setActiveThread] = React.useState<{
        id: string
        messages: any[]
        object: string
        created_at: number
        metadata: {}
    } | null>(null)
    const searchParams = useSearchParams()
    const threadId = searchParams.get('thread')

    async function fetchMesagesFromThread(id: string) {
        try {
            // Retrieve the messages from the thread
            const response = await makeOpenAiApiRequest('/api/message/list', {
                threadId: id,
            })
            const messageList = response.answer.data

            // Retrieve the thread
            const response2 = await makeOpenAiApiRequest(
                '/api/thread/retrieve',
                { threadId: id }
            )
            let thread = response2.answer

            // Set as the active thread
            thread = { ...thread, messages: messageList }
            setActiveThread(thread)
        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(() => {
        if (threadId) fetchMesagesFromThread(threadId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function waitForRunCompletion(run: any, threadId: any) {
        while (run.status === 'queued' || run.status === 'in_progress') {
            const response = await makeOpenAiApiRequest('/api/run/steps/list', {
                runId: run.id,
                threadId: threadId,
            })
            const steps = await response.answer.data
            console.log('Steps => ', steps)

            const responseRun = await makeOpenAiApiRequest(
                '/api/run/retrieve',
                {
                    runId: run.id,
                    threadId: threadId,
                }
            )
            run = await responseRun.answer
            console.log('Run => ', run)

            setTimeout(() => {}, 1000) // Wait for 1 second before checking again
        }
        console.log('Run finished')
        return run
    }

    async function onSubmit(e: any) {
        e.preventDefault()
        if (question.length < 1) return

        setIsLoading(true)
        try {
            // Pipe 1 - Thread exists
            if (activeThread) {
                // Step 1- Create message
                const response = await makeOpenAiApiRequest(
                    '/api/message/create',
                    {
                        message: question,
                        threadId: activeThread.id,
                    }
                )
                const message = await response.answer
                console.log('Message => ', message)
                // Step 2- Create run
                const response2 = await makeOpenAiApiRequest(
                    '/api/run/create',
                    {
                        assistantId: activeAssistant!.id,
                        threadId: activeThread.id,
                    }
                )
                const run = await response2.answer
                console.log('Run => ', run)

                const finishedRun = await waitForRunCompletion(
                    run,
                    activeThread.id
                )
                console.log('Run Finished => ', finishedRun)
                await fetchMesagesFromThread(activeThread.id)
            } else if (!activeThread) {
                // Pipe 2 - Thread does not exist
                // Step 1- Create thread
                const response = await makeOpenAiApiRequest(
                    '/api/thread/create',
                    {
                        assistantId: activeAssistant!.id,
                    }
                )
                const thread = await response.answer
                console.log('Thread => ', thread)
                setActiveThread(thread)
                // Step 2- Create message
                const response2 = await makeOpenAiApiRequest(
                    '/api/message/create',
                    {
                        message: question,
                        threadId: thread.id,
                    }
                )
                const message = await response2.answer
                console.log('Message => ', message)
                // Step 3- Create run
                const response3 = await makeOpenAiApiRequest(
                    '/api/run/create',
                    {
                        assistantId: activeAssistant!.id,
                        threadId: thread.id,
                    }
                )
                const run = await response3.answer
                console.log('Run => ', run)

                const finishedRun = await waitForRunCompletion(run, thread.id)
                console.log('Run Finished => ', finishedRun)
                await fetchMesagesFromThread(thread.id)
            }

            setQuestion('')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const ChatBubble = ({ item, index }: { item: any; index: number }) => {
        return (
            <div
                id={index.toString()}
                className={`flex w-full flex-1 flex-col overflow-hidden py-1 ${
                    index % 2 === 0 ? 'items-start' : 'items-end'
                }`}
            >
                <span>
                    {item.assistant_id && item.role === 'assistant'
                        ? assistants?.find(
                              (assist: AssistantCustom) =>
                                  assist.id === item.assistant_id
                          )?.name ?? 'Unknown'
                        : item.role === 'user'
                          ? 'User'
                          : 'Unknown'}
                </span>
                <div
                    className={`flex max-w-[500px] flex-1 items-center rounded-md border ${
                        index % 2 === 0
                            ? 'bg-gray-200 bg-gradient-to-tl'
                            : 'bg-yellow-200 bg-gradient-to-tr'
                    } overflow-hidden px-3 py-2 text-sm shadow-sm transition-colors hover:bg-opacity-40 hover:shadow-sm hover:drop-shadow-sm`}
                >
                    <div className="overflow-hidden text-ellipsis hyphens-auto break-words font-mono text-base font-medium text-black">
                        {item.content[0].text.value
                            .split('\n')
                            .map((line: string, i: number) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Card className="z-50 w-[100%] max-w-3xl overflow-hidden border-b border-gray-300 bg-gradient-to-b from-zinc-100 pb-6 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle>SupassistGPT</CardTitle>
                        <p className="text-xs font-semibold">
                            THREAD{' '}
                            <span className="pb-2 pl-2 pt-1 font-mono text-sm text-gray-400">
                                {activeThread?.id ?? '<empty>'}
                            </span>
                        </p>
                    </div>
                    <CardDescription>Gptnomics LLC</CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`flex-1 ${
                            activeThread?.messages?.length ?? 0 <= 1
                                ? 'overflow-hidden'
                                : 'overflow-auto'
                        }`}
                    >
                        <div className="relative flex max-h-[500px] w-full max-w-full flex-col items-center space-y-2 overflow-y-auto">
                            <div className="flex w-full flex-col pb-9 text-sm">
                                {activeThread &&
                                    activeThread?.messages?.map(
                                        (item, index) => (
                                            <ChatBubble
                                                key={index.toString()}
                                                item={item}
                                                index={index}
                                            />
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="">
                    <div className="flex flex-1 flex-row items-end justify-between space-x-2">
                        <Textarea
                            className="h-9 max-h-20 min-h-[36px] w-full overflow-hidden hyphens-auto break-words"
                            placeholder="When am I free?"
                            value={question}
                            id="question"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    onSubmit(e)
                                }
                            }}
                            onChange={(e) => setQuestion(e.target.value)}
                        ></Textarea>
                        <Button
                            className="hover:animate-pulse hover:shadow-sm"
                            id="submit"
                            disabled={isLoading}
                            type="submit"
                            onClick={onSubmit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    onSubmit(e)
                                }
                            }}
                        >
                            {!isLoading ? (
                                <ResumeIcon />
                            ) : (
                                <UpdateIcon className="animate-spin" />
                            )}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}

export default ChatContainer
