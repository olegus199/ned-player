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
    TrackSkipPayload,
    OrUndefined,
    GlobalPlayerContextValue,
    GlobalPlayerProviderProps,
    CurrentTrack,
    ILoop,
    PlayPausePayload,
} from './types.ts';
import { formatAudioTime, normalizePlaylist, shuffleArr } from './utils.ts';
import useAudioEngine from './hooks/useAudioEngine.tsx';

const GlobalPlayerContext = createContext<OrUndefined<GlobalPlayerContextValue>>(undefined);

export const GlobalPlayerProvider: FC<GlobalPlayerProviderProps> = ({
    children,
    playlist,
}) => {
    const [normalizedPlaylist, setNormalizedPlaylist] = useState<CurrentTrack[]>(() => normalizePlaylist(playlist));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loop, setLoop] = useState<ILoop>(ILoop.None);

    const audioRef = useRef<HTMLAudioElement>(null);
    // Saving a ref to an unshuffledPlaylist playlist to reset to it when unshuffling
    const unshuffledPlaylist = useRef<CurrentTrack[]>([]);

    const {
        audioDuration,
        audioTime,
        handleCurrentTimeChange,
        handlePlayPause,
        handleVolumeChange,
        isPlaying,
        loopTrack,
        volume,
    } = useAudioEngine(
        audioRef,
        loop,
        handleChangeTrack,
        normalizedPlaylist.length,
        currentIndex,
    );

    // Normalizing playlist if changed from props
    useEffect(() => {
        const normalized = normalizePlaylist(playlist);

        setNormalizedPlaylist(normalized);
        unshuffledPlaylist.current = normalized;
    }, [playlist]);

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
                handlePlayPause(PlayPausePayload.Pause, true);
                return;
            }

            // Clamping to 0 if reached the end of a looped playlist
            const nextLooped = next % length;

            setCurrentIndex(isLoopPlaylist ? nextLooped : next);
        } else {
            const prev = currentIndex - 1;

            // Stop the playing if not in playlist loop and it's the first track
            if (!isLoopPlaylist && prev < 0) {
                handlePlayPause(PlayPausePayload.Pause, true);
                return;
            }

            // Clamping to the last element of a looped playlist if reached the first track
            const prevLooped = (prev + length) % length;

            setCurrentIndex(isLoopPlaylist ? prevLooped : prev);
        }
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
                formattedDuration: formatAudioTime(audioDuration),
                formattedTime: formatAudioTime(audioTime),
                handleCurrentTimeChange,
                handleLoopChange,
                handlePlayPause,
                handleSkip,
                handleStop: () => { handlePlayPause(PlayPausePayload.Pause, true) },
                handleVolumeChange,
                isPlaying,
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
