import { array, boolean, type Infer, integer, object, optional, string } from "superstruct";

export const TabHeader = object({
  label: string(),
  value: string(),
  enableSorting: optional(boolean()),
});

export const TabTable = object({
  totalItems: integer(),
  totalPages: integer(),
  header: array(TabHeader),
  items: array(object()),
});

export const TabProperty = object({
  label: string(),
  value: string(),
});

export const TabItem = object({
  label: string(),
  value: string(),

  props: optional(array(TabProperty)),
  table: optional(TabTable),
});

export const TabProps = object({
  default: string(),
  items: array(TabItem),
});

export type TabHeader = Infer<typeof TabHeader>;
export type TabTable = Infer<typeof TabTable>;
export type TabProperty = Infer<typeof TabProperty>;
export type TabItem = Infer<typeof TabItem>;
export type TabProps = Infer<typeof TabProps>;
