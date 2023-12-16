import React, { ChangeEvent } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

import AssistantTool from './AssistantTool';
import { Separator } from '@/components/ui/separator';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons';
import { Textarea } from '@/components/ui/textarea';
import '@/app/styles/scrollbar.css';
import { useAssistants } from '@/app/AssistantsContext';
import { makeOpenAiApiRequest } from '@/lib/openai_api';

const AssisstantBox = ({
    assistant,
    setActive,
}: {
    assistant: AssistantCustom;
    setActive: (assistant: AssistantCustom, id?: string) => void;
}) => {
    const { modelsList, assistants, setAssistants } = useAssistants();
    let { name, description, tools, id, file_ids, instructions, model, pendingChanges } = assistant;
    const [open, setOpen] = React.useState(false);
    const [assistantModelId, setAssistantModelId] = React.useState<string>();

    React.useEffect(() => {
        if (model) {
            setAssistantModelId(modelsList?.find((modelI: Model) => modelI.id === model)?.id);
        }
    }, [model, modelsList]);

    // const toolTypeString = (ToolType as ToolTypeIndex)[tools[0].type];

    React.useEffect(() => {
        // Compare active assistant with the assistant with the same id in assistants
        // If they are different, set pendingChanges to true
        const matchingAssistant = assistants?.find((a: AssistantCustom) => a.id === id);
        if (matchingAssistant) {
            if (
                matchingAssistant.instructions !== instructions ||
                matchingAssistant.model !== model ||
                matchingAssistant.file_ids !== file_ids ||
                matchingAssistant.tools !== tools ||
                matchingAssistant.name !== name ||
                matchingAssistant.description !== description
            ) {
                setActive({ ...assistant, pendingChanges: true });
            } else {
                setActive({ ...assistant, pendingChanges: false });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instructions, model, file_ids, tools, name, description]);

    return (
        <div className="flex flex-col items-center justify-start flex-1 w-full gap-2 p-1 mt-2 overflow-auto border rounded-md">
            <Collapsible className="w-full" defaultOpen>
                <div className="flex items-center justify-between space-x-4">
                    <p className="text-sm font-bold">Instructions</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <CaretSortIcon className="w-4 h-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <Textarea
                        className="flex w-full min-h-[200px] max-h-[330px] text-sm font-mono text-gray-600 break-words overflow-auto hyphens-auto"
                        id="instructions"
                        value={!instructions ? '' : instructions}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const value = e.target.value;
                            const updatedAssistant = { ...assistant, instructions: value };
                            setActive(updatedAssistant);
                        }}
                    ></Textarea>
                </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-col items-start justify-start w-full">
                <p className="pb-1 text-sm font-bold">Models</p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between w-full"
                        >
                            {assistantModelId
                                ? modelsList?.find((model: Model) => model.id === assistantModelId)
                                      ?.id
                                : 'Select model...'}
                            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search assistant..." />
                            <CommandEmpty>No assistants found.</CommandEmpty>
                            <CommandGroup>
                                {modelsList?.slice(0, 6).map((model: Model) => (
                                    <CommandItem
                                        key={model.id}
                                        value={model.id}
                                        onSelect={(currentValue: string) => {
                                            setAssistantModelId(currentValue);
                                            const updatedAssistant = {
                                                ...assistant,
                                                model: currentValue,
                                            };
                                            setActive(updatedAssistant);
                                            setOpen(false);
                                            console.log('currentValue => ', currentValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                assistantModelId === model.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {model.id}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col items-start justify-start w-full">
                <p className="pb-1 text-sm font-bold">Tools</p>
                {tools.map((tool: Tool, index: number) => (
                    <AssistantTool key={index.toString()} tool={tool} activeAssistant={assistant} />
                ))}
                <div className="flex flex-col items-start justify-center w-full">
                    <div className="flex flex-row items-center justify-between w-full h-8 mb-1">
                        <p className="text-sm font-bold">Files</p>

                        <div className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-300 hover:shadow-md">
                            <PlusIcon className="w-4 h-4 text-black hover:scale-105" />
                        </div>
                    </div>
                    {file_ids?.map((file_id: string, index: number) => (
                        <Button
                            key={index.toString()}
                            variant={'outline'}
                            className="h-6 rounded-lg"
                        >
                            <p className="font-mono text-sm text-gray-600">{`File ${index + 1}`}</p>
                        </Button>
                    ))}
                </div>
            </div>
            {pendingChanges && (
                <>
                    <Separator className="bg-gray-300" />
                    <div className="flex flex-row justify-between w-full space-x-2">
                        <Button
                            variant={'secondary'}
                            className="w-full"
                            onClick={() => {
                                setActive(assistant, assistant.id);
                            }}
                        >
                            {'Revert'}
                        </Button>
                        <Button
                            variant={'default'}
                            className="w-full"
                            onClick={async () => {
                                const response = await makeOpenAiApiRequest(
                                    '/api/assistant/modify',
                                    {
                                        assistant: assistant,
                                    }
                                );
                                const data = await response;
                                if (data) {
                                    setActive({ ...assistant, pendingChanges: false });
                                }
                                console.log('data => ', data);
                            }}
                        >
                            {'Save'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AssisstantBox;
