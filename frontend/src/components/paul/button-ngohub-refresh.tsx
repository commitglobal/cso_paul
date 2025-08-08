import { Button } from "@/components/ui/button";
import { apiGetUrls } from "@/constants/api-urls";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

type NgohubRefreshButtonProps = {
  title?: string;
};

export default function NgoHubRefreshButton({ title }: NgohubRefreshButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-x-1.5 hover:cursor-pointer"
      onClick={() => {
        fetch(apiGetUrls.ngohubRefresh, {
          method: "GET",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .catch((error) => {
            window.alert("Failed to refresh NGOHub: " + error.message);
          });
      }}
    >
      <ArrowPathIcon aria-hidden="true" className="h-5 w-5 -ml-0.5" />
      {title ? title : t("users.team.ngohub_refresh")}
    </Button>
  );
}
