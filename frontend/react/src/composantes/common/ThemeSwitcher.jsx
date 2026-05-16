import React, { useContext } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <button onClick={toggleTheme} className="theme-toggle" title={t('theme.switch')}>
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeSwitcher;