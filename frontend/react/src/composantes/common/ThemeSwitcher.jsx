// src/composantes/common/ThemeSwitcher.jsx
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { t } = useTranslation();

    return (
        <button onClick={toggleTheme} className="theme-toggle" title={t('theme.switch')}>
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeSwitcher;