import { useEffect, useState } from "react";
import { LanguageContext } from "./languageContext";

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

    useEffect(() =>{
        localStorage.setItem("language", language);
    }, [language])

    return (
        <LanguageContext.Provider value={{language, setLanguage}}>{children}</LanguageContext.Provider>
    );
};