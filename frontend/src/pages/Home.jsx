import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";

const Home = () => {
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];

    return (
        <>
            <div>
                <p>{t.home}</p>
            </div>
            <div>
                <p>{t.recentlyAdded}</p>
            </div>
            <div>
                <p>{t.currentlyWatching}</p>
            </div>
            <div>
                <p>{t.yourLibrary}</p>
            </div>
        </>
    );
};

export default Home;