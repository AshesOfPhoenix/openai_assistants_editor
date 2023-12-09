'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Switch } from '../ui/switch';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useAssistants } from '@/app/AssistantsContext';
import AssisstantBox from './AssisstantBox';

import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const AssistantsContainer = () => {
    const { assistants, setAssistants, fetchAssistants, activeAssistant, setActiveAssistant } = useAssistants();
    const [open, setOpen] = React.useState(false);

    const handleSetActive = React.useCallback(
        (assistant: Assistant) => {
            setActiveAssistant(assistant);
            // Update only the active property of the relevant assistant
        },
        [setActiveAssistant]
    );

    React.useEffect(() => {
        if (assistants && assistants.length > 0) {
            setActiveAssistant(assistants[0]);
        }
    }, [assistants, setActiveAssistant]);

    return (
        <>
            <Card className="border-b w-[600px] border-gray-300 bg-gradient-to-b from-zinc-100 pb-4 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30">
                <CardHeader>
                    <CardTitle>Assistants</CardTitle>
                    <CardDescription>Activate GPTs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-full items-start flex-col">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {activeAssistant ? activeAssistant.name : 'Select assistant...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search assistant..." />
                                    <CommandEmpty>No assistants found.</CommandEmpty>
                                    <CommandGroup>
                                        {assistants?.map((assistant) => (
                                            <CommandItem
                                                key={assistant.id}
                                                value={assistant.id}
                                                onSelect={(currentValue) => {
                                                    // setActiveAssistant(currentValue);
                                                    setActiveAssistant(
                                                        assistants?.find(
                                                            (value: Assistant) => value.label === currentValue
                                                        )
                                                    );
                                                    setOpen(false);
                                                    console.log('currentValue => ', currentValue);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        activeAssistant?.label === assistant.label
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {assistant.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <p className="text-sm font-mono text-gray-400 pt-1 pl-2 pb-2">{activeAssistant?.label}</p>
                        {assistants ? (
                            activeAssistant ? (
                                <AssisstantBox assistant={activeAssistant} setActive={handleSetActive} />
                            ) : null
                        ) : (
                            <ReloadIcon className="w-6 h-6 animate-spin" onClick={() => fetchAssistants()} />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="">
                    <div className="flex flex-1 flex-row justify-between items-center space-x-2"></div>
                </CardFooter>
            </Card>
        </>
    );
};

export default AssistantsContainer;
