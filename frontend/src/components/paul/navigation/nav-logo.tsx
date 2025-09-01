import logo from "@/assets/paul-logo.svg";
import logomark from "@/assets/paul-logomark.svg";
import { useSidebar } from "@/components/hooks/use-sidebar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export function NavLogo() {
  const { t } = useTranslation();
  const { state } = useSidebar();

  const navLogo = state === "collapsed" ? logomark : logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <Link href="/">
            <img alt={t("navigation.home")} src={navLogo} className="h-8 w-auto" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
