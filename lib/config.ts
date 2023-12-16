interface ToolFunction {
    name: string;
    description: string;
    parameters: { properties: {}; required: string[]; type: string };
}

interface Tool {
    type: string;
    function: ToolFunction;
}

interface Metadata {
    [key: string]: any;
}

interface Assistant {
    [key: string]: any;
    name: string;
    description: string | null;
    model: string;
    instructions: string;
    tools: Tool[];
    file_ids: string[];
}

interface AssistantCustom {
    [key: string]: any;
    pendingChanges: boolean;
    created_at: number;
    description: string | null;
    file_ids: string[];
    id: string;
    instructions: string;
    metadata: Metadata;
    model: string;
    name: string;
    object: string;
    tools: Tool[];
    label: string;
}

interface Model {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}

interface RootObject {
    [index: number]: AssistantCustom;
}
