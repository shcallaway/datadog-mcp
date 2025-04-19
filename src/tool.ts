import { z } from "zod";

abstract class Tool<T extends z.ZodObject<any>> {
  name: string;
  description: string;
  schema: T;

  constructor(name: string, description: string, schema: T) {
    this.name = name;
    this.description = description;
    this.schema = schema;
  }

  abstract handler: (params: z.infer<T>) => Promise<any>;
}

export { Tool };
