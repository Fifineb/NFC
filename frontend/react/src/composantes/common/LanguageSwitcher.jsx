// composantes/common/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', name: 'العربية', flag: '🇩🇿', dir: 'rtl' }
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (code, dir) => {
        i18n.changeLanguage(code);
        localStorage.setItem('language', code);
        document.documentElement.dir = dir;
        document.documentElement.lang = code;
        setIsOpen(false);
        
        // Recharger la page pour appliquer RTL correctement
        if (dir === 'rtl') {
            document.body.style.direction = 'rtl';
        } else {
            document.body.style.direction = 'ltr';
        }
    };

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button 
                className="lang-btn" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Changer la langue"
            >
                🌐 <span>{currentLanguage.flag} {currentLanguage.name}</span>
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code, lang.dir)}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                        >
                            <span className="lang-option-flag">{lang.flag}</span>
                            <span className="lang-option-name">{lang.name}</span>
                            {i18n.language === lang.code && <span className="lang-check">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;