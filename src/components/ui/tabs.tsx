"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabContextType {
  activeTab: string | undefined;
  setActiveTab: (value: string) => void;
}

const TabContext = React.createContext<TabContextType>({
  activeTab: undefined,
  setActiveTab: () => null,
});

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    const value = React.useMemo(
      () => ({ activeTab, setActiveTab: (value: string) => setActiveTab(value) }),
      [activeTab]
    );

    return (
      <TabContext.Provider value={value}>
        <div className={cn("flex flex-col", className)} ref={ref} {...props}>
          {children}
        </div>
      </TabContext.Provider>
    );
  }
);

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("flex border-b border-input", className)} ref={ref} {...props} />
    );
  }
);

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabContext);
    return (
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === value}
        className={cn(
          "px-4 py-2 text-sm font-medium border-b-2",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          activeTab === value
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground",
          className
        )}
        onClick={() => setActiveTab(value)}
        ref={ref}
        {...props}
      />
    );
  }
);

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, value, children, ...props }, ref) => {
    const { activeTab } = React.useContext(TabContext);
    
    if (activeTab !== value) {
      return null;
    }

    return (
      <div
        role="tabpanel"
        aria-hidden={activeTab !== value}
        className={cn("mt-4 focus:outline-none", className)}
        tabIndex={0}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Tabs.displayName = "Tabs";
TabList.displayName = "TabList";
Tab.displayName = "Tab";
TabPanel.displayName = "TabPanel";

export { Tabs, TabList, Tab, TabPanel };
