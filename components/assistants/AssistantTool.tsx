import React from 'react';
import { Switch } from '../ui/switch';

enum ToolType {
    'retrieval' = 'Retrieval',
    'code_interpreter' = 'Code Interpreter',
    'function' = 'Function',
}

interface ToolTypeIndex {
    [key: string]: ToolType;
}

const AssistantTool = ({ tool, activeAssistant }: { tool: Tool; activeAssistant: Assistant }) => {
    return (
        <div className="flex flex-col w-full h-full justify-start py-[6px]">
            <div className="flex flex-1 flex-row justify-between items-center w-full">
                <p className="text-sm font-medium">{(ToolType as ToolTypeIndex)[tool.type]}</p>
                <div className="flex h-full justify-center">
                    <Switch />
                </div>
            </div>
            <span className="text-xs">{tool?.function?.description}</span>
        </div>
    );
};

export default AssistantTool;
