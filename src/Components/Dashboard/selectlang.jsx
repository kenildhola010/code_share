import React, { useEffect, useState, useRef } from 'react';

const Selectlang = ({ sockett, onChange }) => {
    const [selectedLanguage, SelectLan] = useState('javascript');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'python', label: 'Python' },
        { id: 'cpp', label: 'C++' },
        { id: 'c', label: 'C' },
        { id: 'html', label: 'HTML' },
        { id: 'css', label: 'CSS' }
    ];

    const selectLanguageFunction = (lang) => {
        SelectLan(lang);
        sockett?.emit('Updated langauge for backend', lang);
        sockett?.emit('Updated mode for backend', lang);
        
        onChange({ target: { value: lang } });
        setIsOpen(false);
    };

    useEffect(() => {
        sockett?.on('Updated language for users', (lang) => {
            SelectLan(lang);
        });

        sockett?.on('Language for new user', (lang) => {
            SelectLan(lang);
        });
        
        return () => {
            sockett?.off('Updated language for users');
            sockett?.off('Language for new user');
        };
    }, [sockett]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = languages.find(l => l.id === selectedLanguage)?.label || selectedLanguage;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Language Mode
            </label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 text-left leading-tight focus:outline-none focus:border-indigo-500 transition-all duration-200"
            >
                <span className="font-medium text-sm">{currentLabel}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                type="button"
                                onClick={() => selectLanguageFunction(lang.id)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between ${
                                    selectedLanguage === lang.id 
                                    ? 'bg-indigo-600/20 text-indigo-400 font-semibold' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {lang.label}
                                {selectedLanguage === lang.id && (
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Selectlang;