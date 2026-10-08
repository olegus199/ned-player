import { useEffect, useState } from 'react';
import { AudioEngineOptions, AudioRef } from '../types';
import useLatest from './useLatest';

function playAudio(audio: HTMLAudioElement, onFail: () => void): void {
    audio.play().catch((err: DOMException) => {
        // AbortError = interrupted by a src change; the next sync handles it
        if (err.name === 'AbortError') {
            return;
        }

        console.error(err);
        onFail();
    });
}

/**
 * Owns playback state of a single <audio> element.
 * Knows nothing about playlists or loop modes.
 * Time and duration live in NedPlayerTimeProvider so they don't re-render the main context.
 */
const useAudioEngine = (audioRef: AudioRef, { src, onEnded }: AudioEngineOptions) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(1);

    const onEndedRef = useLatest(onEnded);

    // State -> element: `isPlaying` is the source of truth, the element follows it.
    // A src change while playing re-runs this, which autoplays the new track.
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio || !src) {
            return;
        }

        if (isPlaying) {
            playAudio(audio, pause);
        } else {
            audio.pause();
        }
    }, [audioRef, isPlaying, src]);

    // Element -> state. Subscribed once; onEndedRef always holds the latest callback.
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const syncVolume = () => setVolumeState(audio.volume);
        const handleEnded = () => onEndedRef.current();

        syncVolume();
        audio.addEventListener('volumechange', syncVolume);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('volumechange', syncVolume);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioRef, onEndedRef]);

    function seek(ratio: number): void {
        const audio = audioRef.current;

        if (!audio || !audio.duration) {
            return;
        }

        audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;

        // The browser's own 'timeupdate' arrives a moment later, after React has
        // re-rendered with the old time (the progress bar would jump back for a frame).
        // Dispatching it synchronously lets time listeners update in the same batch
        // as the caller's state changes (e.g. the slider clearing its drag ratio).
        audio.dispatchEvent(new Event('timeupdate'));
    }

    function play(): void {
        setIsPlaying(true);
    }

    function pause(): void {
        setIsPlaying(false);
    }

    function stop(): void {
        setIsPlaying(false);
        seek(0);
    }

    function restart(): void {
        seek(0);

        // Needed after 'ended': the element is paused even though we still "want" to play
        const audio = audioRef.current;
        if (isPlaying && audio) {
            playAudio(audio, pause);
        }
    }

    function setVolume(value: number): void {
        const audio = audioRef.current;

        if (audio) {
            // State updates via 'volumechange'
            audio.volume = Math.min(Math.max(value, 0), 1);
        }
    }

    function toggleMute(): void {
        setVolume(volume === 0 ? 1 : 0);
    }

    return {
        isPlaying,
        pause,
        play,
        restart,
        seek,
        setVolume,
        stop,
        toggleMute,
        volume,
    };
};

export default useAudioEngine;
