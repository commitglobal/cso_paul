// Adapter using custom provider from nuqs:
import { router, usePage } from "@inertiajs/react";
import { unstable_createAdapterProvider, renderQueryString } from "nuqs/adapters/custom";

export function useNuqsInertiaAdapter() {
  const { url } = usePage();
  const searchParams = new URL(location.origin + url).searchParams;

  function updateUrl(search, options) {
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

export const NuqsInertiaAdapter = unstable_createAdapterProvider(useNuqsInertiaAdapter);
