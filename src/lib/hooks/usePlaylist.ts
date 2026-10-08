import { useMemo, useState } from 'react';
import { CurrentTrack, ILoop, OrNull, Playlist, TrackSkipPayload } from '../types';
import { normalizePlaylist, shuffleArr } from '../utils';

const range = (length: number): number[] => Array.from({ length }, (_, i) => i);

const usePlaylist = (playlist: Playlist) => {
    const tracks = useMemo(() => normalizePlaylist(playlist), [playlist]);

    const [order, setOrder] = useState(() => range(tracks.length));
    const [position, setPosition] = useState(0);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loop, setLoop] = useState<ILoop>(ILoop.None);

    const [prevTracks, setPrevTracks] = useState(tracks);

    if (tracks !== prevTracks) {
        setPrevTracks(tracks);
        setOrder(range(tracks.length));
        setPosition(0);
        setIsShuffle(false);
    }

    const currentTrack: CurrentTrack = tracks[order[position]] ?? null;

    function getSkipTarget(direction: TrackSkipPayload): OrNull<number> {
        const length = order.length;

        if (length === 0) {
            return null;
        }

        const target = position + (direction === TrackSkipPayload.Next ? 1 : -1);

        if (loop === ILoop.Playlist) {
            return (target + length) % length;
        }

        return target >= 0 && target < length ? target : null;
    }

    function toggleShuffle(): void {
        const currentIdx = order[position];

        if (currentIdx === undefined) {
            return;
        }

        if (isShuffle) {
            setOrder(range(tracks.length));
            setPosition(currentIdx);
        } else {
            const rest = range(tracks.length).filter((i) => i !== currentIdx);
            setOrder([currentIdx, ...shuffleArr(rest)]);
            setPosition(0);
        }

        setIsShuffle(!isShuffle);
    }

    function cycleLoop(): void {
        setLoop((prev) => (prev + 1) % 3);
    }

    return {
        currentTrack,
        cycleLoop,
        getSkipTarget,
        goTo: setPosition,
        isShuffle,
        loop,
        position,
        toggleShuffle,
    };
};

export default usePlaylist;
