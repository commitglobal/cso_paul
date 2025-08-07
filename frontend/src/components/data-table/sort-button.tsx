import { Button } from "@/components/ui/button";
import { QUERY_PARAM_SORT } from "@/constants/query-params";
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { createParser, useQueryState } from "nuqs";
import { useTranslation } from "react-i18next";

const sortParser = createParser<{ key: string; direction: "asc" | "desc" }>({
  parse(value) {
    if (!value) return null;
    const [key, dir] = value.split(",");
    if (!key) return null;

    const direction = (dir === "desc" ? "desc" : "asc") as "asc" | "desc";
    return { key, direction };
  },

  serialize({ key, direction }) {
    return `${key},${direction}`;
  },
});

export function SortButton({ enableSorting, headerId }: { enableSorting: boolean; headerId: string }) {
  const { t } = useTranslation();

  const [sort, setSort] = useQueryState(QUERY_PARAM_SORT, sortParser.withOptions({ clearOnDefault: true }));

  const setSorting = (columnId: string) => {
    if (!sort || sort.key !== columnId) {
      setSort({ key: columnId, direction: "asc" });
    } else if (sort.direction === "asc") {
      setSort({ key: columnId, direction: "desc" });
    } else {
      setSort(null);
    }
  };

  return (
    enableSorting && (
      <Button
        aria-label={t("table.sortBy", { column: headerId })}
        variant="ghost"
        size="sm"
        className="hover:cursor-pointer"
        onClick={() => {
          setSorting(headerId);
        }}
      >
        {sort?.key === headerId ? (
          sort.direction === "asc" ? (
            <ArrowDownIcon className="h-3 w-3" />
          ) : (
            <ArrowUpIcon className="h-3 w-3" />
          )
        ) : (
          <ArrowsUpDownIcon className="h-3 w-3 opacity-50" />
        )}
      </Button>
    )
  );
}
