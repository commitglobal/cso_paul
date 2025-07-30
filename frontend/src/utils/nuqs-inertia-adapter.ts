import { router, usePage } from "@inertiajs/react";
import { renderQueryString } from "nuqs/adapters/custom";

type UpdateUrlOptions = {
  history?: "replace" | "push";
  scroll?: boolean;
  shallow?: boolean;
};

export function useNuqsInertiaAdapter() {
  const { url } = usePage();
  const searchParams = new URL(location.origin + url).searchParams;

  function updateUrl(search: URLSearchParams, options: UpdateUrlOptions = {}) {
    const newUrl = new URL(location.href);
    newUrl.search = renderQueryString(search);
    router.visit(newUrl.pathname + newUrl.search, {
      replace: options.history === "replace",
      preserveScroll: !options.scroll,
      preserveState: options.shallow,
    });
  }

  return { searchParams, updateUrl };
}
