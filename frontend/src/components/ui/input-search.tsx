import { Input } from "./input";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export function InputSearch(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-2.5 flex items-center pointer-events-none text-gray-500">
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
