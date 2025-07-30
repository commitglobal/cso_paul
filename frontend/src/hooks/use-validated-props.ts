import { usePage } from "@inertiajs/react";
import { type PageProps } from "@inertiajs/core";
import { Struct, validate } from "superstruct";

export function useValidatedProps<T extends PageProps>(struct: Struct<T>) {
  const { props, ...rest } = usePage<T>();

  // @todo remove after BE is implemented
  if (import.meta.env.DEV) {
    const [err] = validate(props, struct);
    if (err && err.key !== "username") {
      console.log("==== Validation fail =====");
      console.log("Message:", err.message);
      console.log("Property:", err.key);
      console.log("Received value:", err.value);
    }
  }

  return { props, ...rest };
}
