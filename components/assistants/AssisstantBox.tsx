import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '../ui/button';

import AssistantTool from './AssistantTool';
import { Separator } from '../ui/separator';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons';
import { Textarea } from '../ui/textarea';
import '../../app/styles/scrollbar.css';
import { useAssistants } from '@/app/AssistantsContext';

const AssisstantBox = ({
    assistant,
    setActive,
}: {
    assistant: Assistant;
    setActive: (assistant: Assistant) => void;
}) => {
    const { modelsList } = useAssistants();
    let { name, description, active, tools, id, file_ids, instructions, model } = assistant;
    const [open, setOpen] = React.useState(false);
    const [assistantModelId, setAssistantModelId] = React.useState<string>();

    React.useEffect(() => {
        if (model) {
            setAssistantModelId(modelsList?.find((modelI: Model) => modelI.id === model)?.id);
        }
    }, [model, modelsList]);

    // const toolTypeString = (ToolType as ToolTypeIndex)[tools[0].type];

    return (
        <div className="flex flex-1 flex-col justify-start items-center w-full p-1 border rounded-md mt-2 gap-2">
            <Collapsible className="w-full" defaultOpen>
                <div className="flex items-center justify-between space-x-4">
                    <p className="text-sm font-bold">Instructions</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <CaretSortIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <Textarea
                        className="flex w-full min-h-[200px] max-h-[400px] text-sm font-mono text-gray-600 break-words overflow-auto hyphens-auto"
                        id="instructions"
                        value={!instructions ? '' : instructions}
                        onChange={(e) => {}}
                    ></Textarea>
                </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-col w-full items-start justify-start">
                <p className="text-sm font-bold pb-1">Models</p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {assistantModelId
                                ? modelsList?.find((model: Model) => model.id === assistantModelId)?.id
                                : 'Select model...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                        onSelect={(currentValue) => {
                                            setAssistantModelId(currentValue);
                                            setOpen(false);
                                            console.log('currentValue => ', currentValue);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                assistantModelId === model.id ? 'opacity-100' : 'opacity-0'
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
            <div className="flex flex-col w-full items-start justify-start">
                <p className="text-sm font-bold pb-1">Tools</p>
                {tools.map((tool: Tool, index: number) => (
                    <AssistantTool key={index.toString()} tool={tool} activeAssistant={assistant} />
                ))}
                <div className="flex flex-col w-full items-start justify-center">
                    <div className="flex flex-row w-full h-8 items-center justify-between mb-1">
                        <p className="text-sm font-bold">Files</p>

                        <div className="rounded-full flex justify-center items-center hover:bg-gray-300 hover:shadow-md h-6 w-6">
                            <PlusIcon className="text-black h-4 w-4 hover:scale-105" />
                        </div>
                    </div>
                    {file_ids?.map((file_id: string, index: number) => (
                        <Button key={index.toString()} variant={'outline'} className="rounded-lg h-6">
                            <p className="text-sm font-mono text-gray-600">{`File ${index + 1}`}</p>
                        </Button>
                    ))}
                </div>
            </div>
            <Separator className="bg-gray-300" />
            <div className="flex flex-row w-full justify-between space-x-2">
                <Button
                    variant={'secondary'}
                    className="w-full"
                    onClick={() => {
                        // implement save
                    }}
                >
                    {'Revert'}
                </Button>
                <Button
                    variant={'default'}
                    className="w-full"
                    onClick={() => {
                        // implement save
                    }}
                >
                    {'Save'}
                </Button>
            </div>
        </div>
    );
};

export default AssisstantBox;