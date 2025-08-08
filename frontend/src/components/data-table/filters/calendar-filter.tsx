"use client";

import { PopoverWrapper } from "@/components/data-table/filters/filter-popover-wrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useQueryState } from "nuqs";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface DateFilterProps {
  filterName: string;
  className?: string;
}

export function CalendarFilter({ filterName, className }: DateFilterProps) {
  const { t } = useTranslation();

  const filterNameFrom = `${filterName}__gte`;
  const filterNameTo = `${filterName}__lte`;

  const [fromDate, setFromDate] = useQueryState(filterNameFrom, {
    parse: (value) => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    },
    serialize: (value) => (value ? format(value, "yyyy-MM-dd") : ""),
    defaultValue: null,
  });

  const [toDate, setToDate] = useQueryState(filterNameTo, {
    parse: (value) => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    },
    serialize: (value) => (value ? format(value, "yyyy-MM-dd") : ""),
    defaultValue: null,
  });

  const [fromOpen, setFromOpen] = React.useState(false);
  const [toOpen, setToOpen] = React.useState(false);

  const handleFromDateSelect = (date: Date | undefined) => {
    setFromDate(date || null);
    setFromOpen(false);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    setToDate(date || null);
    setToOpen(false);
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
  };

  return (
    <PopoverWrapper isFilterEmpty={!fromDate && !toDate} headerId={filterName}>
      <div className={cn("w-full max-w-sm bg-white border rounded-lg p-4 shadow-sm", className)}>
        {/* Header with Clear link */}
        <div className="flex justify-between items-center mb-4">
          <Button variant="link" className="text-purple-600 p-0 h-auto font-normal" onClick={handleClear}>
            {t("table.filter.calendar.clear")}
          </Button>
        </div>

        {/* From Date */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="from-date" className="text-sm font-medium text-gray-700">
            {t("table.filter.calendar.fromDate")}
          </Label>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="from-date"
                  value={fromDate ? format(fromDate, "MMM d, yyyy") : ""}
                  placeholder="Select date"
                  readOnly
                  className="pr-10 cursor-pointer"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate || undefined}
                onSelect={handleFromDateSelect}
                disabled={(date) => {
                  return toDate ? date > toDate : false;
                }}
                captionLayout="dropdown"
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="to-date" className="text-sm font-medium text-gray-700">
            {t("table.filter.calendar.toDate")}
          </Label>
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="to-date"
                  value={toDate ? format(toDate, "MMM d, yyyy") : ""}
                  placeholder="Select date"
                  readOnly
                  className="pr-10 cursor-pointer"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate || undefined}
                onSelect={handleToDateSelect}
                disabled={(date) => {
                  return fromDate ? date < fromDate : false;
                }}
                captionLayout="dropdown"
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </PopoverWrapper>
  );
}
