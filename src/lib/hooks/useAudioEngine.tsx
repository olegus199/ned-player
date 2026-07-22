import { RefObject, useEffect, useState } from 'react';
import {
    AudioTime,
    AudioVolume,
    ILoop,
    OrNull,
    PlayPausePayload,
    TrackSkipPayload
} from '../types';

const useAudioEngine = (
    audioRef: RefObject<OrNull<HTMLAudioElement>>,
    loop: ILoop,
    handleChangeTrack: (payload: TrackSkipPayload) => void,
    normalizedPlaylistLength: number,
    currentIndex: number,
) => {
    const [audioDuration, setAudioDuration] = useState<AudioTime>();
    const [audioTime, setAudioTime] = useState<AudioTime>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState<AudioVolume>();

    function loopTrack(): void {
        if (!audioRef.current) {
            return;
        }

        handleCurrentTimeChange(0.0);
        handlePlay();
    }

    function handlePlay(): void {
        if (normalizedPlaylistLength === 0) {
            return;
        }

        audioRef.current?.play().then(() => {
            setIsPlaying(true);
        });
    }

    function handlePause(resetTime = false): void {
        if (normalizedPlaylistLength === 0) {
            return;
        }

        audioRef.current?.pause();
        setIsPlaying(false);

        if (resetTime) {
            handleCurrentTimeChange(0.0);
        }
    }

    function handlePlayPause(payload: PlayPausePayload, resetTime = false): void {
        if (payload === PlayPausePayload.Pause) {
            handlePause(resetTime);
        } else {
            handlePlay();
        }
    }

    function handleCurrentTimeChange(newTime: number): void {
        const audio = audioRef.current;
        const duration = audio?.duration;

        if (!audio || !duration) {
            return;
        }

        const time = Math.min(newTime * duration, duration);
        audio.currentTime = time;

        setAudioTime(time);
    }

    function handleVolumeChange(newVolume: number): void {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.volume = newVolume;
        setVolume(newVolume);
    }

    // Play the track when currentIndex changes and playlist was played back
    useEffect(() => {
        if (isPlaying) {
            handlePlay();
        }
    }, [currentIndex, isPlaying]);

    // Event listeners for audio element
    useEffect(() => {
        const audio = audioRef.current;

        function handleLoadedMetadata(): void {
            const duration = audio?.duration;
            const volume = audio?.volume;

            setAudioDuration(duration);
            setVolume(volume);
        }

        function handleTimeUpdate(): void {
            const time = audio?.currentTime;

            setAudioTime(time);
        }

        function handleEnd(): void {
            if (loop === ILoop.Track) {
                loopTrack();
            } else {
                handleChangeTrack(TrackSkipPayload.Next);
            }
        }

        audio?.addEventListener('timeupdate', handleTimeUpdate);
        audio?.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio?.addEventListener('ended', handleEnd);

        return () => {
            audio?.removeEventListener('timeupdate', handleTimeUpdate);
            audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio?.removeEventListener('ended', handleEnd);
        };
    }, [loop, normalizedPlaylistLength, currentIndex]);

    // General event listeners
    useEffect(() => {
        function handleKeyboardClick(e: KeyboardEvent): void {
            const { code } = e;

            switch (code) {
                case 'Space':
                    e.preventDefault();
                    handlePlayPause(isPlaying ? PlayPausePayload.Pause : PlayPausePayload.Play);
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyboardClick);

        return () => {
            document.removeEventListener('keydown', handleKeyboardClick);
        }
    }, [isPlaying]);

    return {
        audioDuration,
        audioTime,
        handleCurrentTimeChange,
        handlePlayPause,
        handleVolumeChange,
        isPlaying,
        loopTrack,
        volume,
    };
};

export default useAudioEngine;
