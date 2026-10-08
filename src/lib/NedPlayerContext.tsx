import { createContext, FC, useContext, useRef } from 'react';
import {
    ILoop,
    NedPlayerContextValue,
    NedPlayerProviderProps,
    OrUndefined,
    PlayPausePayload,
    TrackSkipPayload,
} from './types';
import { NedPlayerTimeProvider } from './NedPlayerTimeContext';
import usePlaylist from './hooks/usePlaylist';
import useAudioEngine from './hooks/useAudioEngine';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

const NedPlayerContext = createContext<OrUndefined<NedPlayerContextValue>>(undefined);

export const NedPlayerProvider: FC<NedPlayerProviderProps> = ({ children, playlist }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const queue = usePlaylist(playlist);
    const engine = useAudioEngine(audioRef, {
        src: queue.currentTrack?.audioSrc,
        onEnded: () => skip(TrackSkipPayload.Next),
    });

    function skip(direction: TrackSkipPayload): void {
        if (queue.loop === ILoop.Track) {
            engine.restart();
            return;
        }

        const target = queue.getSkipTarget(direction);

        if (target === null) {
            engine.stop(); // edge of a non-looped playlist
        } else if (target === queue.position) {
            engine.restart(); // looped playlist with a single track
        } else {
            queue.goTo(target); // the engine autoplays the new src if playing
        }
    }

    function seek(ratio: number): void {
        if (ratio >= 1) {
            skip(TrackSkipPayload.Next);
        } else {
            engine.seek(ratio);
        }
    }

    function playPause(payload: PlayPausePayload): void {
        if (payload === PlayPausePayload.Play) {
            engine.play();
        } else {
            engine.pause();
        }
    }

    useKeyboardShortcuts({
        togglePlay: () => playPause(engine.isPlaying ? PlayPausePayload.Pause : PlayPausePayload.Play),
        toggleMute: engine.toggleMute,
    });

    const value: NedPlayerContextValue = {
        currentTrack: queue.currentTrack,
        handleLoopChange: queue.cycleLoop,
        handlePlayPause: playPause,
        handleSeek: seek,
        handleSkip: skip,
        handleStop: engine.stop,
        handleVolumeChange: engine.setVolume,
        handleVolumeToggle: engine.toggleMute,
        isPlaying: engine.isPlaying,
        isShuffle: queue.isShuffle,
        loop: queue.loop,
        shufflePlaylist: queue.toggleShuffle,
        volume: engine.volume,
    };

    return (
        <NedPlayerContext.Provider value={value}>
            <audio ref={audioRef} src={queue.currentTrack?.audioSrc} preload='metadata' />
            <NedPlayerTimeProvider audioRef={audioRef}>
                {children}
            </NedPlayerTimeProvider>
        </NedPlayerContext.Provider>
    );
};

export const useNedPlayerContext = (): NedPlayerContextValue => {
    const context = useContext(NedPlayerContext);

    if (!context) {
        throw new Error('useNedPlayerContext must be used within a NedPlayerProvider');
    }

    return context;
};
