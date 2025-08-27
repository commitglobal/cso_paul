import BlankLayout from "@/layouts/blank-layout";
import BaseError from "@/pages/errors/base-error";
import type { BaseErrorProps } from "@/pages/errors/error-props";

export default function Public({ code, title, message }: BaseErrorProps) {
  return <BaseError code={code} title={title} message={message} />;
}

Public.layout = BlankLayout;
