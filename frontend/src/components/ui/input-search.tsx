"use client"

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type InputSearchProps = {
  initialValue: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
}

export function InputSearch(
  {
    initialValue,
    placeholder,
    onSearch,
    onChange,
  }: InputSearchProps
) {
  const {t} = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInternalValue] = useState<string>(initialValue);


  const handleChange = (val: string) => {
    if (typeof onChange === "function") {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };
  const handleClear = () => {
    handleChange("");
    onSearch("");
  };
  const handleFocusInput = () => {
    inputRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };
  const handleSearchClick = () => {
    if (inputValue) {
      onSearch(inputValue);
    } else {
      handleFocusInput();
    }
  };

  return (
    <div className="relative flex w-full items-center text-gray-500">
      <Button
        variant="icon"
        size="icon"
        className="absolute flex items-center text-gray-500 size-5 ml-2.5"
        onClick={handleSearchClick}>
        <MagnifyingGlassIcon className="size-4"/>
        <span className="sr-only">
          {t('input.search.focus')}
        </span>
      </Button>

      <Input
        name="search"
        value={inputValue}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('input.search.placeholder')}
        aria-label={placeholder || t('input.search.label')}
        className="px-10 text-base text-gray-900"
        ref={inputRef}
      />

      {inputValue && (
        <Button
          variant="icon"
          size="icon"
          className="absolute top-1/2 right-3 -translate-y-1/2 size-5"
          onClick={handleClear}>
          <XMarkIcon className="size-4"/>
          <span className="sr-only">
            {t('input.search.clear')}
          </span>
        </Button>
      )}
    </div>
  )
}
