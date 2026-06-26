import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { courseDetailTabs } from "../lib/constants";

export function CourseTabs() {
  return (
    <TabsList
      variant="line"
      className="mb-8 flex h-auto w-full flex-wrap items-center justify-start gap-6 rounded-none border-b border-[#E8E8E3] p-0 pb-9.5 text-inherit"
    >
      {courseDetailTabs.map((tab) => (
        <TabsTrigger
          key={tab.key}
          value={tab.key}
          className="h-auto flex-none rounded-none border-0 px-0 pb-3 text-sm font-medium text-[#7A7F7C] shadow-none transition-colors duration-300 hover:text-[#2F7D62] data-active:font-semibold data-active:text-[#2F7D62] data-active:shadow-none after:bottom-[-1px] after:bg-[#2F7D62] focus-visible:ring-0"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
