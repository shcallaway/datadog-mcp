interface ToolParams {
  [key: string]: any;
}

interface ToolSchema {
  type: string;
  properties: {
    [key: string]: {
      type: string;
      description?: string;
      required?: boolean;
    };
  };
  required?: string[];
}

abstract class Tool<T = any> {
  name: string;
  description: string;
  schema: ToolSchema;
  params: T;

  constructor(
    name: string,
    description: string,
    schema: ToolSchema,
    params: T
  ) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.params = params;
  }

  abstract handler(params: T): Promise<any>;
}

export { Tool, ToolParams, ToolSchema };
