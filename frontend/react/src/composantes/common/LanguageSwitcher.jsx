// composantes/common/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇩🇿' }
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

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('language', code);
        setIsOpen(false);
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
                            onClick={() => changeLanguage(lang.code)}
                            className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                            {i18n.language === lang.code && <span>✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;