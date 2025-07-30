import { type Infer, object, optional, string } from "superstruct";

export const Breadcrumb = object({
  label: string(),
  url: optional(string()),
});

export type Breadcrumb = Infer<typeof Breadcrumb>;
