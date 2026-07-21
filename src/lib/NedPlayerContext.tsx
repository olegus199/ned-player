import {
    createContext,
    FC,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import AudioElement from './AudioElement.tsx';
import {
    PlayPausePayload,
    TrackSkipPayload,
    OrUndefined,
    GlobalPlayerContextValue,
    GlobalPlayerProviderProps,
    AudioTime,
    CurrentTrack,
    AudioVolumne,
    ILoop,
} from './types.ts';
import { normalizePlaylist, shuffleArr } from './utils.ts';

const GlobalPlayerContext = createContext<OrUndefined<GlobalPlayerContextValue>>(undefined);

export const GlobalPlayerProvider: FC<GlobalPlayerProviderProps> = ({
    children,
    playlist,
}) => {
    const [normalizedPlaylist, setNormalizedPlaylist] = useState<CurrentTrack[]>(() => normalizePlaylist(playlist));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loop, setLoop] = useState<ILoop>(ILoop.None);
    const [audioDuration, setAudioDuration] = useState<AudioTime>();
    const [audioTime, setAudioTime] = useState<AudioTime>();
    const [volume, setVolume] = useState<AudioVolumne>();
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    // Saving a ref to an unshuffledPlaylist playlist to reset to it when unshuffling
    const unshuffledPlaylist = useRef<CurrentTrack[]>([]);

    // Normalizing playlist if changed from props
    useEffect(() => {
        const normalized = normalizePlaylist(playlist);

        setNormalizedPlaylist(normalized);
        unshuffledPlaylist.current = normalized;
    }, [playlist]);

    // Event listeners to set audio duration, time and handle end of a song
    useEffect(() => {
        const audio = audioRef.current;

        function setDuration(): void {
            const duration = audio?.duration;

            setAudioDuration(duration);
        }

        function setCurrentTime(): void {
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

        audio?.addEventListener('timeupdate', setCurrentTime);
        audio?.addEventListener('loadedmetadata', setDuration);
        audio?.addEventListener('ended', handleEnd);

        return () => {
            audio?.removeEventListener('timeupdate', setCurrentTime);
            audio?.removeEventListener('loadedmetadata', setDuration);
            audio?.removeEventListener('ended', handleEnd);
        };
    }, [loop, normalizedPlaylist.length, currentIndex]);

    // Play the track when currentIndex changes and playlist was played back
    useEffect(() => {
        if (isPlaying) {
            handlePlay();
        }
    }, [currentIndex, isPlaying]);

    function handlePlayPause(payload: PlayPausePayload): void {
        if (payload === PlayPausePayload.Pause) {
            handlePause();
        } else {
            handlePlay();
        }
    }

    function handlePlay(): void {
        if (normalizedPlaylist.length === 0) {
            return;
        }

        audioRef.current?.play().then(() => {
            setIsPlaying(true);
        });
    }

    function handlePause(resetTime = false): void {
        if (normalizedPlaylist.length === 0) {
            return;
        }

        audioRef.current?.pause();
        setIsPlaying(false);

        if (resetTime) {
            handleCurrentTimeChange(0.0);
        }
    }

    function handleSkip(payload: TrackSkipPayload): void {
        if (loop === ILoop.Track) {
            loopTrack();
        } else {
            handleChangeTrack(payload);
        }
    }

    function handleChangeTrack(payload: TrackSkipPayload): void {
        const length = normalizedPlaylist.length;

        if (length === 0) {
            return;
        }

        const lastIdx = length - 1;
        const isLoopPlaylist = loop === ILoop.Playlist;

        if (payload === TrackSkipPayload.Next) {
            const next = currentIndex + 1;

            // Stop the playing if not in playlist loop and it's the last track
            if (!isLoopPlaylist && next > lastIdx) {
                handlePause(true);
                return;
            }

            // Clamping to 0 if reached the end of a looped playlist
            const nextLooped = next % length;

            setCurrentIndex(isLoopPlaylist ? nextLooped : next);
        } else {
            const prev = currentIndex - 1;

            // Stop the playing if not in playlist loop and it's the first track
            if (!isLoopPlaylist && prev < 0) {
                handlePause(true);
                return;
            }

            // Clamping to the last element of a looped playlist if reached the first track
            const prevLooped = (prev + length) % length;

            setCurrentIndex(isLoopPlaylist ? prevLooped : prev);
        }

        // const audio = audioRef.current;
        //
        // if (audio && (!audio.paused || audio.ended)) {
        //     setTimeout(() => audioRef.current?.play(), 0);
        // }
    }

    function loopTrack(): void {
        if (!audioRef.current) {
            return;
        }

        handleCurrentTimeChange(0.0);
        handlePlay();
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

    function shufflePlaylist(): void {
        const newIsShuffle = !isShuffle;
        const currentTrack = normalizedPlaylist[currentIndex];

        if (newIsShuffle) {
            const filtered = normalizedPlaylist.filter((track) => track?.id !== currentTrack?.id);
            const shuffled = [currentTrack, ...shuffleArr(filtered)];

            setNormalizedPlaylist(shuffled);
            setCurrentIndex(0);
        } else {
            const foundIndex = unshuffledPlaylist.current.findIndex((track) => track?.id === currentTrack?.id);

            if (foundIndex !== -1) {
                setNormalizedPlaylist(unshuffledPlaylist.current);
                setCurrentIndex(foundIndex);
            }
        }

        setIsShuffle(newIsShuffle);
    }

    function handleLoopChange(): void {
        setLoop((loop + 1) % 3);
    }

    return (
        <GlobalPlayerContext.Provider
            value={{
                audioDuration,
                audioTime,
                currentTrack: normalizedPlaylist[currentIndex],
                handleCurrentTimeChange,
                handleLoopChange,
                handlePlayPause,
                handleSkip,
                handleStop: () => { handlePause(true) },
                handleVolumeChange,
                isShuffle,
                loop,
                shufflePlaylist,
                volume,
            }}
        >
            <AudioElement ref={audioRef} />
            {children}
        </GlobalPlayerContext.Provider>
    );
};

export const useGlobalPlayerContext = (): GlobalPlayerContextValue => {
    const context = useContext(GlobalPlayerContext);
    if (!context) {
        throw new Error(
            'usePlayerContext must be used within a GlobalPlayerProvider',
        );
    }
    return context;
};
