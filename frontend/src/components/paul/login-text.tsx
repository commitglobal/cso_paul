import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function LoginText() {
  const { t } = useTranslation();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("loginText.title")}</h1>
        </div>
      </CardHeader>
      <CardContent>{t("loginText.description")}</CardContent>
    </Card>
  );
}
