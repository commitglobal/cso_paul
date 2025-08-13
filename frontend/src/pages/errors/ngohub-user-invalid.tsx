import BlankLayout from "@/layouts/blank-layout";
import BaseError from "@/pages/errors/base-error";
import { useTranslation } from "react-i18next";

export default function NgohubUserInvalid() {
  const { t } = useTranslation();

  return (
    <BaseError code={401} title={t("errors.ngohub.userInvalidTitle")} message={t("errors.ngohub.userInvalidMessage")} />
  );
}

NgohubUserInvalid.layout = BlankLayout;
