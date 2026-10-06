import { useState } from "react";
import { LanguageContext } from "./languageContext";

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState("en");

    return (
        <LanguageContext.Provider value={{language, setLanguage}}>{children}</LanguageContext.Provider>
    );
};