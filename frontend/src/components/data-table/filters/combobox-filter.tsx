import { PopoverWrapper } from "@/components/data-table/filters/filter-popover-wrapper";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { FilterItem } from "@/types/filter";
import { CheckIcon } from "@heroicons/react/24/outline";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

type ComboboxFilterProps = {
  filterName: string;
  filterItems: FilterItem[];
};

export function ComboboxFilter({ filterName, filterItems }: ComboboxFilterProps) {
  const { t } = useTranslation();

  const [filters, setFilters] = useQueryState(
    filterName,
    parseAsArrayOf(parseAsString.withDefault(""), ",").withDefault([])
  );

  const handleSelect = (value: string) => {
    if (filters === null) {
      setFilters([value]);
    } else if (filters.includes(value)) {
      setFilters(filters.filter((filter) => filter !== value));
    } else {
      setFilters([...filters, value]);
    }
  };

  const isFilterEmpty = filters === null || filters.length === 0;

  return (
    <PopoverWrapper isFilterEmpty={isFilterEmpty} headerId={filterName}>
      <Command>
        <CommandInput placeholder={t("table.filterBy", { column: filterName })} className="h-9" />

        <CommandList>
          <CommandEmpty>{t("table.filter.noResults")}</CommandEmpty>

          <CommandGroup>
            {filterItems.map((option) => (
              <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    filters !== null && filters.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverWrapper>
  );
}
