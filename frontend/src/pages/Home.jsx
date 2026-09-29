import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";

const Home = () => {
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];

    return (
        <div>
            <p>{t.home}</p>
        </div>
    );
};

export default Home;