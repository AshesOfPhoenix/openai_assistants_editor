'use client';
import { useAssistants } from '@/app/AssistantsContext';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ResumeIcon, UpdateIcon } from '@radix-ui/react-icons';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiKey } from '@/lib/openai_api';

const ChatContainer = () => {
    const { assistants, activeAssistant } = useAssistants();
    const [question, setQuestion] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [activeThread, setActiveThread] = React.useState<{
        id: string;
        messages: any[];
        object: string;
        created_at: number;
        metadata: {};
    } | null>(null);
    const searchParams = useSearchParams();
    const threadId = searchParams.get('thread');

    async function fetchMesagesFromThread(id: string) {
        try {
            const apiKey = getApiKey();

            const config = {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            };

            // Retrieve the messages from the thread
            const response = await axios.post('/api/message/list', { threadId: id }, config);
            const messageList = response.data.answer.data;

            // Retrieve the thread
            const response2 = await axios.post('/api/thread/retrieve', { threadId: id }, config);
            let thread = response2.data.answer;

            // Set as the active thread
            thread = { ...thread, messages: messageList };
            setActiveThread(thread);
            console.log('Thread => ', thread);
        } catch (error) {
            console.error(error);
        }
    }

    React.useEffect(() => {
        if (threadId) fetchMesagesFromThread(threadId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function waitForRunCompletion(run: any, threadId: any) {
        while (run.status === 'queued' || run.status === 'in_progress') {
            const response = await axios.post('/api/run/steps/list', {
                runId: run.id,
                threadId: threadId,
            });
            const steps = await response.data.answer.data;
            console.log('Steps => ', steps);

            const responseRun = await axios.post('/api/run/retrieve', {
                runId: run.id,
                threadId: threadId,
            });
            run = await responseRun.data.answer;
            console.log('Run => ', run);

            setTimeout(() => {}, 1000); // Wait for 1 second before checking again
        }
        return run;
    }

    async function onSubmit(e: any) {
        e.preventDefault();
        if (question.length < 1) return;

        setIsLoading(true);
        try {
            // Pipe 1 - Thread exists
            if (activeThread) {
                // Step 1- Create message
                const response = await axios.post('/api/message/create', {
                    message: question,
                    threadId: activeThread.id,
                });
                const message = await response.data.answer;
                console.log('Message => ', message);
                // Step 2- Create run
                const response2 = await axios.post('/api/run/create', {
                    assistantId: activeAssistant!.id,
                    threadId: activeThread.id,
                });
                const run = await response2.data.answer;
                console.log('Run => ', run);

                const finishedRun = await waitForRunCompletion(run, activeThread.id);
                console.log('Run Finished => ', finishedRun);
            } else if (!activeThread) {
                // Pipe 2 - Thread does not exist
                // Step 1- Create thread
                const response = await axios.post('/api/thread/create', {
                    assistantId: activeAssistant!.id,
                });
                const thread = await response.data.answer;
                console.log('Thread => ', thread);
                setActiveThread(thread);
                // Step 2- Create message
                const response2 = await axios.post('/api/message/create', {
                    message: question,
                    threadId: thread.id,
                });
                const message = await response2.data.answer;
                console.log('Message => ', message);
                // Step 3- Create run
                const response3 = await axios.post('/api/run/create', {
                    assistantId: activeAssistant!.id,
                    threadId: thread.id,
                });
                const run = await response3.data.answer;
                console.log('Run => ', run);

                const finishedRun = await waitForRunCompletion(run, thread.id);
                console.log('Run Finished => ', finishedRun);
            }

            await fetchMesagesFromThread(activeThread!.id);
            setQuestion('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

        /* setHistory((prevHistory) => [...prevHistory, question]);
        try {
            await fetch('/api/assistant', {
                method: 'POST',
                body: JSON.stringify({ question, history, activeAssistant }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setHistory((prevHistory) => [...prevHistory, data.answer]);
                });
        } catch (error) {
            // Handle any errors that occur during the API call
            setHistory((prevHistory) => [...prevHistory, 'Something went wrong. Please try again.']);
        } finally {
            setIsLoading(false);
        } */
    }

    return (
        <>
            <Card className="border-b border-gray-300 overflow-hidden z-50 bg-gradient-to-b from-zinc-100 pb-6 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static w-[100%] max-w-3xl lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center">
                        <CardTitle>SupassistGPT</CardTitle>
                        <p className="font-semibold text-xs">
                            THREAD{' '}
                            <span className="text-sm font-mono text-gray-400 pt-1 pl-2 pb-2">
                                {activeThread?.id}
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
                        <div className="relative flex w-full max-w-full max-h-[500px] overflow-y-auto items-center flex-col space-y-2">
                            <div className="flex flex-col text-sm w-full pb-9">
                                {activeThread?.messages.map((item, index) => (
                                    <div
                                        key={index.toString()}
                                        id={index.toString()}
                                        className={`w-full flex flex-1 flex-col py-1 overflow-hidden ${
                                            index % 2 === 0 ? 'items-start' : 'items-end'
                                        }`}
                                    >
                                        <span>
                                            {item.assistant_id && item.role === 'assistant'
                                                ? assistants?.find(
                                                      (assist: Assistant) =>
                                                          assist.id === item.assistant_id
                                                  )?.name ?? 'Unknown'
                                                : item.role === 'user'
                                                ? 'User'
                                                : 'Unknown'}
                                        </span>
                                        <div
                                            className={`max-w-[500px] flex items-center flex-1 rounded-md border ${
                                                index % 2 === 0
                                                    ? 'bg-gradient-to-tl bg-gray-200'
                                                    : 'bg-gradient-to-tr bg-yellow-200'
                                            } px-3 py-2 text-sm shadow-sm transition-colors overflow-hidden hover:shadow-md hover:drop-shadow-sm hover:bg-opacity-40`}
                                        >
                                            <div className="break-words overflow-hidden hyphens-auto text-ellipsis text-base text-black font-mono font-medium">
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
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="">
                    <div className="flex flex-1 flex-row justify-between items-end space-x-2">
                        <Textarea
                            className="w-full break-words overflow-hidden hyphens-auto min-h-[36px] h-9 max-h-20"
                            placeholder="When am I free?"
                            value={question}
                            id="question"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    onSubmit(e);
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
                                    onSubmit(e);
                                }
                            }}
                        >
                            {!isLoading ? <ResumeIcon /> : <UpdateIcon className="animate-spin" />}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        // Fetch data from external API
        const res = await fetch('https://.../data');
        const data = await res.json();

        // Pass data to the page via props
        return { props: { data } };
    } catch (error) {
        console.error('An error occurred while fetching chained data:', error);

        // Return an error state through props or redirect, etc.
        return { props: { error: 'Failed to fetch data.' } };
    }
};

export default ChatContainer;
