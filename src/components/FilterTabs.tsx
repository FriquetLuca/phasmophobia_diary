import TabButton from './TabButton';

export type TabType = 'evidence' | 'hunt' | 'settings';

interface FilterTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tabList: (tab: TabType) => React.ReactNode;
}

const tabs: TabType[] = ['evidence', 'hunt', 'settings'];

interface SelectedTabProps {
  tab: TabType;
  activeTab: TabType;
  children: React.ReactNode;
}

function SelectedTab({ tab, activeTab, children }: SelectedTabProps) {
  if (tab === activeTab) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">{children}</div>
    );
  }
  return <></>;
}

export default function FilterTabs({
  activeTab,
  setActiveTab,
  tabList,
}: FilterTabsProps) {
  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-center gap-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <TabButton
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      <div className="py-3 min-h-25 border-b border-gray-100 bg-gray-50/50 rounded-b-md px-4">
        {tabs.map((tab) => (
          <SelectedTab tab={tab} activeTab={activeTab}>
            {tabList(tab)}
          </SelectedTab>
        ))}
      </div>
    </div>
  );
}
