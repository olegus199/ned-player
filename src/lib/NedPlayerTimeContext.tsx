import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react';
import { NedPlayerTimeContextValue, NedPlayerTimeProviderProps, OrUndefined } from './types';
import { formatAudioTime } from './utils';

const NedPlayerTimeContext = createContext<OrUndefined<NedPlayerTimeContextValue>>(undefined);

/**
 * Owns the fast-changing state (current time, duration).
 * Because it lives here and not in NedPlayerProvider, 'timeupdate' re-renders
 * only components that call useNedPlayerTime(), not every player consumer.
 */
export const NedPlayerTimeProvider: FC<NedPlayerTimeProviderProps> = ({ audioRef, children }) => {
    const [audioTime, setAudioTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const syncTime = () => setAudioTime(audio.currentTime);
        const syncDuration = () => {
            setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        };
        // Fires when src changes: drop the previous track's values right away
        const reset = () => {
            setAudioTime(0);
            setAudioDuration(0);
        };

        syncTime();
        syncDuration();

        audio.addEventListener('timeupdate', syncTime);
        audio.addEventListener('durationchange', syncDuration);
        audio.addEventListener('emptied', reset);

        return () => {
            audio.removeEventListener('timeupdate', syncTime);
            audio.removeEventListener('durationchange', syncDuration);
            audio.removeEventListener('emptied', reset);
        };
    }, [audioRef]);

    const value = useMemo<NedPlayerTimeContextValue>(() => ({
        audioDuration,
        audioTime,
        formattedDuration: formatAudioTime(audioDuration),
        formattedTime: formatAudioTime(audioTime),
    }), [audioDuration, audioTime]);

    return (
        <NedPlayerTimeContext.Provider value={value}>
            {children}
        </NedPlayerTimeContext.Provider>
    );
};

export const useNedPlayerTime = (): NedPlayerTimeContextValue => {
    const context = useContext(NedPlayerTimeContext);

    if (!context) {
        throw new Error('useNedPlayerTime must be used within a NedPlayerProvider');
    }

    return context;
};
