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
  const isActive = activeTab === tab;

  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`pb-3 pt-2 px-8 uppercase font-bold text-xs tracking-[0.2em] transition-all duration-300 relative outline-none group ${
        isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {t(`tabs.${tab}`)}

      <div
        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-500 bg-red-600 ${
          isActive
            ? 'w-full opacity-100 shadow-[0_0_8px_rgba(220,38,38,0.8)]'
            : 'w-0 opacity-0'
        }`}
      />
      {isActive && (
        <div className="absolute inset-0 bg-linear-to-t from-red-900/10 to-transparent pointer-events-none" />
      )}
    </button>
  );
}
