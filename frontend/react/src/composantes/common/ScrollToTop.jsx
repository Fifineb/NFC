import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Vérifier la position du scroll
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Remonter en haut
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button 
                    onClick={scrollToTop}
                    className="scroll-to-top"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        zIndex: 1000,
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default ScrollToTop;