import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <MainContent>
        <div className="flex flex-col gap-4 py-4 ">
          <TabsContent value={defaultTab}>
          <div className="flex flex-col gap-4 py-4">
            {React.Children.map(children, (child) => child)}
          </div>
          </TabsContent>
        </div>
      </MainContent>
    </Tabs>
  );
}
