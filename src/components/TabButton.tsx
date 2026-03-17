import { useTranslation } from 'react-i18next';
import type { TabType } from './FilterTabs';

interface TabButtonProps {
  tab: TabType;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabButton({
  tab,
  activeTab,
  setActiveTab,
}: TabButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`pb-2 px-6 uppercase font-bold text-sm tracking-widest transition-all relative ${
        activeTab === tab
          ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-black"
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {t(`tabs.${tab}`)}
    </button>
  );
}
