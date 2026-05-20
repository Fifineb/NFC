// composantes/common/ThemeSwitcher.jsx
import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button 
            className="theme-switcher"
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeSwitcher;