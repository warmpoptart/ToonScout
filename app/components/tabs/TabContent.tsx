import { useState, useEffect, Suspense } from "react";
import { TabComponent } from "../tabs/TabList";

interface TabContentProps {
  curr: TabComponent | undefined;
}

export default function TabContent({ curr }: TabContentProps) {
  return (
    <div className={`pb-2 transition ease-in-out duration-500 opacity-0`}>
      <Suspense fallback={<div>Loading...</div>}>
        {curr ? (
          <curr.component />
        ) : (
          <div>Select a tab to view the content.</div>
        )}
      </Suspense>
    </div>
  );
}
