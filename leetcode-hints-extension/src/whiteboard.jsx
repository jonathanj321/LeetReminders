import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

const App = () => {
    const [problemId, setProblemId] = useState('global');
    const [editor, setEditor] = useState(null);

    // NEW: Track theme state in React so we can style our custom UI
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        // 1. Get current LeetCode problem ID
        chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
            const leetCodeTab = tabs.find(t => t.url && t.url.includes('leetcode.com/problems/'));
            if (leetCodeTab) {
                const match = leetCodeTab.url.match(/problems\/([^/]+)/);
                if (match && match[1]) {
                    setProblemId(match[1]);
                }
            }
        });

        // 2. Setup System Theme Listener
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Update local React state for the label
            setIsDarkMode(e.matches);

            // Update Tldraw editor state
            if (editor) {
                editor.user.updateUserPreferences({
                    colorScheme: e.matches ? 'dark' : 'light'
                });
            }
        };

        // Initialize listeners
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [editor]);

    // Define styles based on mode
    const labelStyle = {
        position: 'absolute',
        top: '60px',
        left: '10px',
        zIndex: 10,
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '500',
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s, color 0.2s', // Smooth transition

        // Dynamic Colors
        background: isDarkMode ? '#2f2f2f' : '#f0f0f0',
        color: isDarkMode ? '#e0e0e0' : '#333333',
        border: isDarkMode ? '1px solid #444' : '1px solid #ddd'
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div style={labelStyle}>
                Current Problem: {problemId}
            </div>

            <Tldraw
                persistenceKey={`lc-drawing-${problemId}`}
                onMount={(editorInstance) => {
                    setEditor(editorInstance);
                    editorInstance.setCurrentTool('draw');

                    // Force sync on mount
                    editorInstance.user.updateUserPreferences({
                        colorScheme: isDarkMode ? 'dark' : 'light'
                    });
                }}
            />
        </div>
    );
};

createRoot(document.getElementById('root')).render(<App />);