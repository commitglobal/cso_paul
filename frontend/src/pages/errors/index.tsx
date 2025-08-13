import BaseLayout from "@/layouts/base-layout";
import BaseError from "@/pages/errors/base-error";
import type { BaseErrorProps } from "@/pages/errors/error-props";

export default function Index({ code, title, message }: BaseErrorProps) {
  return <BaseError code={code} title={title} message={message} />;
}

Index.layout = BaseLayout;
