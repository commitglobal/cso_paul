import logomark from "@/assets/paul-logomark.svg";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export function NavLogo() {
  const { t } = useTranslation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Link href="/">
            <img alt={t("navigation.home")} src={logomark} className="h-8 w-auto" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
