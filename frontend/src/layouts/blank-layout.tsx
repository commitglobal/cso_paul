import { Toaster } from "@/components/ui/sonner";
import { renderToast } from "@/layouts/render-toast";
import { CommonPropsBlank } from "@/types/common-props";
import { type Page } from "@inertiajs/core";
import { type ReactNode, useEffect } from "react";

export default function BlankLayout(page: Page<CommonPropsBlank>) {
  useEffect(() => {
    (page.props.flashMessages ?? []).forEach(renderToast);
  }, [page.props.flashMessages]);

  return (
    <>
      <main>{page as unknown as ReactNode}</main>
      <Toaster />
    </>
  );
}
