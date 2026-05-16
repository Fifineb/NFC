import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
//import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  const languages = [
    { code: 'fr', label: t('language.fr'), flag: '🇫🇷' },
    { code: 'en', label: t('language.en'), flag: '🇬🇧' },
    { code: 'ar', label: t('language.ar'), flag: '🇸🇦' }
  ];

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`lang-btn ${language === lang.code ? 'active' : ''}`}
          title={lang.label}
        >
          <span className="flag">{lang.flag}</span>
          <span className="lang-code">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
