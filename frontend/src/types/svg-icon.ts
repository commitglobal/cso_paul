import { type ForwardRefExoticComponent } from "react";
import * as React from "react";

export type SvgIcon =
  | ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>
  | ((props: { className?: string }) => React.JSX.Element);
