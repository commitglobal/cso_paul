import { CalendarFilter } from "@/components/data-table/filters/calendar-filter";
import { ComboboxFilter } from "@/components/data-table/filters/combobox-filter";
import { type FilterGroup, type FilterItem, type FilterKind, FilterKinds } from "@/types/filter";

type FilterButtonProps = {
  enableFilter: boolean;
  headerId: string;
  filterGroup: FilterGroup;
};

export function FilterButton({ enableFilter, headerId, filterGroup }: FilterButtonProps) {
  if (!enableFilter) {
    return null;
  }

  if (!headerId || !filterGroup || !filterGroup.kind || !filterGroup.items) {
    console.error("Invalid filter group data", { headerId, filterGroup });
    return null;
  }

  const filterKind: FilterKind = filterGroup.kind;
  const filterItems: FilterItem[] = filterGroup.items;

  switch (filterKind) {
    case FilterKinds.combobox:
      return <ComboboxFilter filterName={headerId} filterItems={filterItems} />;
    case FilterKinds.calendar:
      return <CalendarFilter filterName={headerId} />;
    default:
      return null;
  }
}
