import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainContent } from "@/layouts/main-content";
import * as React from "react";

export default function TabWrapper({
  defaultTab,
  baseUrl,
  tabs,
  children,
}: {
  defaultTab: string;
  baseUrl: string;
  tabs: { label: string; value: string }[];
  children: React.ReactNode;
}) {
  return (
    <Tabs defaultValue={defaultTab} className="flex items-center">
      <TabsList className="grid w-1/3 grid-cols-3">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => {
              window.location.href = `${baseUrl}${tab.value}`;
            }}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <MainContent>{React.cloneElement(React.Children.only(children) as React.ReactElement)}</MainContent>
    </Tabs>
  );
}
