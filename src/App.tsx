import { useTranslation } from 'react-i18next';

export default function App() {
    const { t } = useTranslation();
    return (
        <>
            <h1>Phasmophobia Diary</h1>
            <p>{t("hello")}</p>
        </>
    );
}
