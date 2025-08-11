import { TabsContent } from "@/components/ui/tabs";
import type { TabItem, TabProperty } from "@/types/tabProps";

function TabContentProperties({ props }: { props: TabProperty[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
      {props.map((prop) => (
        <div className="text-sm">
          <div className="text-sm font-normal text-gray-500">{prop.label}</div>
          <div className="font-medium text-gray-900">{prop.value}</div>
        </div>
      ))}
    </div>
  );
}

export default function GenericTab({ tab }: { tab: TabItem }) {
  return (
    <TabsContent value={tab.value}>
      <div className="flex flex-col gap-4 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-base font-semibold text-gray-900">{tab.label}</h2>
            </div>
            <div className="mt-4 flex gap-4 sm:mt-0 sm:ml-16 sm:flex-none">{/*  Buttons placed here */}</div>
          </div>
        </div>

        <div aria-hidden="true" className="inset-0 flex items-center px-4">
          <div className="w-full border-t border-gray-300" />
        </div>

        {tab.props && <TabContentProperties props={tab.props} />}
        {/*{tab.items && <TabContentItems items={tab.items} />}*/}
      </div>
    </TabsContent>
  );
}
