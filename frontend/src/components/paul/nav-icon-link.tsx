import { Link } from "@inertiajs/react";
import { isValidElement } from "react";
import type { ComponentType, ReactElement, ReactNode } from "react";
import * as React from "react";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
export type IconComponent = ComponentType<React.SVGProps<SVGSVGElement>>;

export interface IconLinkProps {
  href: string;
  method?: HttpMethod;
  icon: IconComponent | ReactElement;
  label: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function NavIconLink({
  href,
  method,
  icon,
  label,
  className = "flex items-center gap-2 text-left text-sm",
  iconClassName = "size-4",
  ...rest
}: IconLinkProps & Omit<React.ComponentProps<typeof Link>, "href" | "method" | "children" | "className">) {
  const Icon = icon as IconComponent;
  const iconNode = isValidElement(icon) ? icon : <Icon className={iconClassName} aria-hidden="true" />;

  return (
    <Link href={href} method={method} className={className} {...rest}>
      {iconNode}
      <span>{label}</span>
    </Link>
  );
}
