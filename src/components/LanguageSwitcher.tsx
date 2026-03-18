import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-sm">
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-3 py-1 tracking-tighter transition-all ${
          i18n.language.startsWith('en')
            ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
            : 'text-zinc-600 hover:text-zinc-400'
        }`}
      >
        🇬🇧
      </button>

      <div className="w-px h-3 bg-zinc-800" />

      <button
        onClick={() => toggleLanguage('fr')}
        className={`px-3 py-1 tracking-tighter transition-all ${
          i18n.language.startsWith('fr')
            ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
            : 'text-zinc-600 hover:text-zinc-400'
        }`}
      >
        🇫🇷
      </button>
    </div>
  );
}
