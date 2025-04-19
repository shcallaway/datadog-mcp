import { z } from "zod";

abstract class Tool<T extends z.ZodType> {
  name: string;
  description: string;
  schema: T;
  params: z.infer<T>;

  constructor(
    name: string,
    description: string,
    schema: T,
    params: z.infer<T>
  ) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.params = params;
  }

  abstract handler(params: z.infer<T>): Promise<any>;
}

export { Tool };
