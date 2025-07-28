"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";
import { type PageSize, pageSizes } from "@/constants/pagination.ts";
import { QUERY_PARAM_PAGE_SIZE } from "@/constants/query-params.ts";


export function PaginationSizeSelector() {
  const {t} = useTranslation();

  const [rowsPerPage, setRowsPerPage] = useQueryState(QUERY_PARAM_PAGE_SIZE, parseAsStringLiteral(pageSizes).withDefault("10"));

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={rowsPerPage.toString()}
          onValueChange={(rowsPerPage) => setRowsPerPage(rowsPerPage as PageSize)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>

            {pageSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size === "all" ? t("pagination.all") : size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 whitespace-nowrap text-sm leading-none">
          {t('pagination.rowsPerPage')}
        </div>
      </div>
    </div>
  );
}
