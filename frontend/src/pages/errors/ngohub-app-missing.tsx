import BlankLayout from "@/layouts/blank-layout";
import BaseError from "@/pages/errors/base-error";
import { useTranslation } from "react-i18next";

export default function NgohubAppMissing() {
  const { t } = useTranslation();

  return (
    <BaseError code={403} title={t("errors.ngohub.appMissingTitle")} message={t("errors.ngohub.appMissingMessage")} />
  );
}

NgohubAppMissing.layout = BlankLayout;
