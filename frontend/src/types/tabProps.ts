import { array, type Infer, object, optional, string } from "superstruct";

export const TabHeader = object({
  label: string(),
  value: string(),
});

export const TabProperty = object({
  label: string(),
  value: string(),
});

export const TabItem = object({
  label: string(),
  value: string(),

  props: optional(array(TabProperty)),

  header: optional(array(TabHeader)),
  items: optional(array(object())),
});

export const TabProps = object({
  default: string(),
  items: array(TabItem),
});

export type TabHeader = Infer<typeof TabHeader>;
export type TabProperty = Infer<typeof TabProperty>;
export type TabItem = Infer<typeof TabItem>;
export type TabProps = Infer<typeof TabProps>;
