import { Switch } from '../ui/switch'

enum ToolType {
    'retrieval' = 'Retrieval',
    'code_interpreter' = 'Code Interpreter',
    'function' = 'Function',
}

interface ToolTypeIndex {
    [key: string]: ToolType
}

const AssistantTool = ({
    tool,
    activeAssistant,
    setActive,
}: {
    tool: Tool
    activeAssistant: AssistantCustom
    setActive: (tool: Tool) => void
}) => {
    return (
        <div className="flex h-full w-full flex-col justify-start py-[6px]">
            <div className="flex w-full flex-1 flex-row items-center justify-between">
                <p className="text-sm font-medium">
                    {(ToolType as ToolTypeIndex)[tool.type]}
                </p>
                <div className="flex h-full justify-center">
                    <Switch
                        checked={tool.active}
                        onCheckedChange={async () => {
                            setActive(tool)
                        }}
                    />
                </div>
            </div>
            <span className="text-xs">{tool?.function?.description}</span>
        </div>
    )
}

export default AssistantTool
