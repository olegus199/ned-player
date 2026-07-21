import { nanoid } from 'nanoid';
import {
    CurrentTrack,
    IDTrack,
    ITrack,
    OrUndefined,
    Playlist,
} from './types';

export function normalizePlaylist(playlist: Playlist): CurrentTrack[] {
    return playlist.map(normalizeTrack);
}

export function normalizeTrack(track: OrUndefined<ITrack | IDTrack | string>): CurrentTrack {
    if (!track) {
        return null;
    }

    const id = typeof track !== 'string' && 'id' in track ? track.id : nanoid();

    if (typeof track === 'string') {
        return { audioSrc: track, id };
    }

    return { ...track, id };
}

export function shuffleArr<T>(arr: T[]): T[] {
    let result = [...arr];

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}
