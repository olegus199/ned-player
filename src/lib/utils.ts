import { nanoid } from 'nanoid';
import {
    AudioTime,
    CurrentTrack,
    GlobalStylesPayload,
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

export function formatAudioTime(seconds: AudioTime): string {
    if (!seconds) {
        return '00:00';
    }

    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

export function setGlobalStyles(payload: GlobalStylesPayload): void {
    switch (payload) {
        case GlobalStylesPayload.Disable:
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            break;
        case GlobalStylesPayload.Enable:
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
            document.body.style.webkitUserSelect = 'auto';
            break;
    }
}
