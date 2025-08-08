import { array, enums, type Infer, object, optional, record, string } from "superstruct";

export const FilterKinds = {
  combobox: "combobox",
  calendar: "calendar",
};

export const FilterKindStruct = enums([FilterKinds.combobox, FilterKinds.calendar]);

export const FilterItem = object({
  label: string(),
  value: string(),
});

export const FilterGroup = object({
  kind: FilterKindStruct,
  items: optional(array(FilterItem)),
});

export const Filters = record(string(), FilterGroup);

export type FilterKind = (typeof FilterKinds)[keyof typeof FilterKinds];
export type FilterItem = Infer<typeof FilterItem>;
export type FilterGroup = Infer<typeof FilterGroup>;
export type Filters = Infer<typeof Filters>;
