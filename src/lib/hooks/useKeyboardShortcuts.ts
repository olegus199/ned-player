import { useEffect } from 'react';
import useLatest from './useLatest';
import { Shortcuts } from '../types';

const useKeyboardShortcuts = (shortcuts: Shortcuts): void => {
    const shortcutsRef = useLatest(shortcuts);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent): void {
            if (
                e.target instanceof HTMLElement &&
                e.target.closest('input, textarea, [contenteditable="true"]')
            ) {
                return;
            }

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    shortcutsRef.current.togglePlay();
                    break;
                case 'KeyM':
                    shortcutsRef.current.toggleMute();
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [shortcutsRef]);
};

export default useKeyboardShortcuts;
