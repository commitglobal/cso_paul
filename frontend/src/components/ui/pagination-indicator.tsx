import { Pagination } from "@/types/pagination.ts";
import { useTranslation } from "react-i18next";

type PaginationIndicatorProps = {
  pagination: Pagination
}

export function PaginationIndicator({pagination}: PaginationIndicatorProps) {
  const {t} = useTranslation();

  const firstItem = (pagination.current_page - 1) * pagination.per_page + 1;
  const lastItem = firstItem + pagination.per_page - 1;

  return (
    <div>
      <p className="flex text-sm text-gray-700">
        {t('pagination.indicator', {from: firstItem, to: lastItem, total: pagination.total_items})}
      </p>
    </div>

  )
}
