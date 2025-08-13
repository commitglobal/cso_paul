import { type Infer, number, object, string, union } from "superstruct";

export type SelectOption = Infer<typeof SelectOption>;

export const SelectOption = object({
  label: string(),
  value: union([string(), number()]),
});
