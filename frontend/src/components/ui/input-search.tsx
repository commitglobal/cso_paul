import { Input } from "./input";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export function InputSearch(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative flex w-full items-center">
      <span className="pointer-events-none absolute flex items-center text-gray-500 left-2.5">
        <MagnifyingGlassIcon aria-hidden="true" className="-ml-0.5 size-5"/>
      </span>
      <Input
        {...props}
        style={{
          paddingLeft: 36,
          ...(props.style || {})
        }}
      />
    </div>
  );
}
