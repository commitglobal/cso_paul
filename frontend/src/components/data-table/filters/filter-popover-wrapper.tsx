import { Button } from "@/components/ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FunnelIcon as FunnelIconOutline } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconFull } from "@heroicons/react/24/solid";
import * as React from "react";
import { useTranslation } from "react-i18next";

type PopoverWrapperProps = {
  isFilterEmpty: boolean;
  headerId: string;
  children: React.ReactNode;
};

export function PopoverWrapper({ isFilterEmpty, headerId, children }: PopoverWrapperProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label={t("table.filterBy", { column: headerId })}
          variant="ghost"
          size="sm"
          className="hover:cursor-pointer"
        >
          {(isFilterEmpty ?? true) ? (
            <FunnelIconOutline className="h-3 w-3 opacity-50" aria-label={headerId} />
          ) : (
            <FunnelIconFull className="h-3 w-3" aria-label={headerId} />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0" align="center">
        {React.cloneElement(React.Children.only(children) as React.ReactElement)}
      </PopoverContent>
    </Popover>
  );
}
