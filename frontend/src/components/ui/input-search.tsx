import { Input } from "./input";
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export function InputSearch(props: React.ComponentProps<typeof Input>) {
  return (
    <div style={{position: "relative", display: "flex", alignItems: "center"}}>
      <span style={{
        position: "absolute",
        left: 10,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        color: "#888"
      }}>
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
