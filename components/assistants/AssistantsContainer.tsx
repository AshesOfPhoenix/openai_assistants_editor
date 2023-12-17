'use client'
import { useAssistants } from '@/app/AssistantsContext'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import AssisstantBox from './AssisstantBox'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const AssistantsContainer = () => {
    const {
        assistants,
        setAssistants,
        fetchAssistants,
        activeAssistant,
        setActiveAssistant,
        isFetchingAssistants,
    } = useAssistants()
    const [open, setOpen] = React.useState(false)

    const handleSetActive = React.useCallback(
        (assistant: AssistantCustom, id?: string) => {
            // setActiveAssistant(assistant);
            if (id) {
                const selectedAssistant = assistants?.find(
                    (value: AssistantCustom) => value.id === id
                )
                if (selectedAssistant) {
                    setActiveAssistant(selectedAssistant)
                }
            } else {
                setActiveAssistant(assistant)
            }
        },
        [setActiveAssistant, assistants]
    )

    React.useEffect(() => {
        if (assistants && assistants.length > 0) {
            setActiveAssistant(assistants[0])
        }
    }, [assistants, setActiveAssistant])

    return (
        <>
            <Card className="w-[600px] border-b border-gray-300 bg-gradient-to-b from-zinc-100 pb-4 pt-4 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-gray-200 lg:p-2 lg:dark:bg-zinc-800/30">
                <CardHeader>
                    <CardTitle>Assistants</CardTitle>
                    <CardDescription>Activate GPTs</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-full flex-col items-start">
                        <Popover
                            open={open && assistants !== undefined}
                            onOpenChange={setOpen}
                        >
                            <PopoverTrigger
                                asChild
                                disabled={activeAssistant?.pendingChanges}
                            >
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {activeAssistant
                                        ? activeAssistant.name
                                        : 'Select assistant...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search assistant..." />
                                    <CommandEmpty>
                                        No assistants found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {assistants?.map(
                                            (assistant: AssistantCustom) => (
                                                <CommandItem
                                                    key={assistant.id}
                                                    value={assistant.id}
                                                    onSelect={(
                                                        currentValue: string
                                                    ) => {
                                                        // setActiveAssistant(currentValue);
                                                        setActiveAssistant(
                                                            assistants?.find(
                                                                (
                                                                    value: AssistantCustom
                                                                ) =>
                                                                    value.label ===
                                                                    currentValue
                                                            )
                                                        )
                                                        setOpen(false)
                                                        console.log(
                                                            'currentValue => ',
                                                            currentValue
                                                        )
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            activeAssistant?.label ===
                                                                assistant.label
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                    {assistant.name}
                                                </CommandItem>
                                            )
                                        )}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <p className="pb-2 pl-2 pt-1 font-mono text-sm text-gray-400">
                            {activeAssistant?.label}
                        </p>
                        <div className="flex w-full flex-1 overflow-auto">
                            {assistants ? (
                                activeAssistant ? (
                                    <AssisstantBox
                                        assistant={activeAssistant}
                                        setActive={handleSetActive}
                                    />
                                ) : null
                            ) : isFetchingAssistants ? (
                                <div className={cn(`flex h-10 w-full`)}>
                                    <ReloadIcon
                                        className="h-6 w-6 animate-spin"
                                        onClick={() => fetchAssistants()}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="">
                    <div className="flex flex-1 flex-row items-center justify-between space-x-2"></div>
                </CardFooter>
            </Card>
        </>
    )
}

export default AssistantsContainer
