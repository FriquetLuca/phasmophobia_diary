import TabButton from './TabButton';

export type TabType = 'evidence' | 'interaction' | 'hunt' | 'settings';

interface FilterTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  tabList: (tab: TabType) => React.ReactNode;
}

const tabs: TabType[] = ['evidence', 'interaction', 'hunt', 'settings'];

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
      <div className="flex justify-center gap-8 border-b border-zinc-700 bg-zinc-950/30">
        {tabs.map((tab, i) => (
          <TabButton
            key={i}
            tab={tab}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        ))}
      </div>

      <div className="py-3 min-h-25 border-b border-zinc-700/50 bg-zinc-800/40 rounded-b-md px-4">
        {tabs.map((tab, i) => (
          <SelectedTab key={i} tab={tab} activeTab={activeTab}>
            <div className="animate-in fade-in slide-in-from-top-1 duration-300">
              {tabList(tab)}
            </div>
          </SelectedTab>
        ))}
      </div>
    </div>
  );
}
