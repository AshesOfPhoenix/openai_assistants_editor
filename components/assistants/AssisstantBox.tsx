import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import React, { ChangeEvent } from 'react'

import { Separator } from '@/components/ui/separator'
import AssistantTool from './AssistantTool'

import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useAssistants } from '@/app/AssistantsContext'
import '@/app/styles/scrollbar.css'
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
import { Textarea } from '@/components/ui/textarea'
import { makeOpenAiApiRequest } from '@/lib/openai_api'
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons'

const AssisstantBox = ({
    assistant,
    setActive,
}: {
    assistant: AssistantCustom
    setActive: (assistant: AssistantCustom, id?: string) => void
}) => {
    const { modelsList, assistants, setAssistants } = useAssistants()
    let {
        name,
        description,
        tools,
        id,
        files,
        instructions,
        model,
        pendingChanges,
    } = assistant
    const [open, setOpen] = React.useState(false)
    const [assistantModelId, setAssistantModelId] = React.useState<string>()

    React.useEffect(() => {
        if (model) {
            setAssistantModelId(
                modelsList?.find((modelI: Model) => modelI.id === model)?.id
            )
        }
    }, [model, modelsList])

    // const toolTypeString = (ToolType as ToolTypeIndex)[tools[0].type];

    React.useEffect(() => {
        // Compare active assistant with the assistant with the same id in assistants
        // If they are different, set pendingChanges to true
        const matchingAssistant = assistants?.find(
            (a: AssistantCustom) => a.id === id
        )
        if (matchingAssistant) {
            console.log('matchingAssistant.tools => ', matchingAssistant.tools)
            console.log('tools => ', tools)

            // compare each tool in the matching assistant with the tool in the active assistant, only compare active property
            // if they are different, set pendingChanges to true
            // if they are the same, set pendingChanges to false
            for (const tool of tools) {
                const matchingTool = matchingAssistant.tools.find(
                    (t: Tool) => t.type === tool.type
                )
                if (matchingTool && matchingTool.active !== tool.active) {
                    setActive({ ...assistant, pendingChanges: true })
                    return
                }
            }

            if (
                matchingAssistant.instructions !== instructions ||
                matchingAssistant.model !== model ||
                matchingAssistant.files !== files ||
                matchingAssistant.name !== name ||
                matchingAssistant.description !== description
            ) {
                setActive({ ...assistant, pendingChanges: true })
            } else {
                setActive({ ...assistant, pendingChanges: false })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instructions, model, files, tools, name, description])

    const setActiveTool = (tool: Tool) => {
        // set a tool with the same type it's property active
        // if the tool is already active, set it to inactive

        const updatedTools = tools.map((t: Tool) => {
            if (t.type === tool.type) {
                return { ...t, active: !t.active }
            } else {
                return t
            }
        })
        const updatedAssistant = {
            ...assistant,
            tools: updatedTools,
        }

        setActive(updatedAssistant)
    }

    return (
        <div className="mt-2 flex w-full flex-1 flex-col items-center justify-start gap-2 overflow-auto rounded-md border p-1">
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
                        className="flex max-h-[330px] min-h-[200px] w-full overflow-auto hyphens-auto break-words font-mono text-sm text-gray-600"
                        id="instructions"
                        value={!instructions ? '' : instructions}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            const value = e.target.value
                            const updatedAssistant = {
                                ...assistant,
                                instructions: value,
                            }
                            setActive(updatedAssistant)
                        }}
                    ></Textarea>
                </CollapsibleContent>
            </Collapsible>
            <div className="flex w-full flex-col items-start justify-start">
                <p className="pb-1 text-sm font-bold">Models</p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {assistantModelId
                                ? modelsList?.find(
                                      (model: Model) =>
                                          model.id === assistantModelId
                                  )?.id
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
                                        onSelect={(currentValue: string) => {
                                            setAssistantModelId(currentValue)
                                            const updatedAssistant = {
                                                ...assistant,
                                                model: currentValue,
                                            }
                                            setActive(updatedAssistant)
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
            <div className="flex w-full flex-col items-start justify-start">
                <p className="pb-1 text-sm font-bold">Tools</p>
                {tools.map((tool: Tool, index: number) => (
                    <AssistantTool
                        key={index.toString()}
                        tool={tool}
                        activeAssistant={assistant}
                        setActive={setActiveTool}
                    />
                ))}
                <div className="flex w-full flex-col items-start justify-center">
                    <div className="mb-1 flex h-8 w-full flex-row items-center justify-between">
                        <p className="text-sm font-bold">Files</p>

                        <div className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-300 hover:shadow-md">
                            <PlusIcon className="h-4 w-4 text-black hover:scale-105" />
                        </div>
                    </div>
                    {files?.map((file: any, index: number) => (
                        <Button
                            key={index.toString()}
                            variant={'outline'}
                            className="h-6 rounded-lg"
                        >
                            <p className="font-mono text-sm text-gray-600">{`${file.filename}`}</p>
                        </Button>
                    ))}
                </div>
            </div>
            {pendingChanges && (
                <>
                    <Separator className="bg-gray-300" />
                    <div className="flex w-full flex-row justify-between space-x-2">
                        <Button
                            variant={'secondary'}
                            className="w-full"
                            onClick={() => {
                                setActive(assistant, assistant.id)
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
                                )
                                const data = await response
                                if (data) {
                                    setActive({
                                        ...assistant,
                                        pendingChanges: false,
                                    })
                                }
                                console.log('data => ', data)
                            }}
                        >
                            {'Save'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default AssisstantBox
