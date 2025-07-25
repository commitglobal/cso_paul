import { useTranslation } from "react-i18next";

type PaginationIndicatorProps = {
  totalItems: number;
  currentPage: number;
  perPage: string;
}

export function PaginationIndicator({totalItems, currentPage, perPage}: PaginationIndicatorProps) {
  const {t} = useTranslation();

  const itemsPerPage = perPage === "all" ? totalItems : parseInt(perPage, 10);

  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = firstItem + itemsPerPage - 1;

  return (
    <div>
      <p className="flex text-sm text-gray-700">
        {t('pagination.indicator', {from: firstItem, to: lastItem, total: totalItems})}
      </p>
    </div>

  )
}
