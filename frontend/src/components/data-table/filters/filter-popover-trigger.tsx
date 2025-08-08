import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";

import { FunnelIcon as FunnelIconOutline } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconFull } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

type FilterPopoverProps = {
  filter: string;
  headerId: string;
};

export function FilterPopoverTrigger({ filter, headerId }: FilterPopoverProps) {
  const { t } = useTranslation();

  return (
    <PopoverTrigger asChild>
      <Button
        aria-label={t("table.filterBy", { column: headerId })}
        variant="ghost"
        size="sm"
        className="hover:cursor-pointer"
      >
        {filter === "" ? (
          <FunnelIconOutline className="h-3 w-3 opacity-50" aria-label={headerId} />
        ) : (
          <FunnelIconFull className="h-3 w-3" aria-label={headerId} />
        )}
      </Button>
    </PopoverTrigger>
  );
}
