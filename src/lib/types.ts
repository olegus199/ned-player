import { ReactNode } from 'react';

export type OrUndefined<T> = T | undefined;

export type OrNull<T> = T | null;

export interface AudioElementProps {
    ref: React.Ref<HTMLAudioElement>;
}

export enum PlayPausePayload {
    Play = 'play',
    Pause = 'pause',
}

export enum TrackSkipPayload {
    Next = 'next',
    Previous = 'previous',
}

export type AudioTime = OrUndefined<number>;

export type AudioVolume = OrUndefined<number>;

export interface NedPlayerContextValue {
    audioDuration: AudioTime;
    audioTime: AudioTime;
    currentTrack: CurrentTrack;
    formattedDuration: string;
    formattedTime: string;
    handleCurrentTimeChange: (newTime: number) => void;
    handleLoopChange: () => void;
    handlePlayPause: (payload: PlayPausePayload) => void;
    handleSkip: (payload: TrackSkipPayload) => void;
    handleStop: (resetTime?: boolean) => void;
    handleVolumeChange: (newVolume: number) => void;
    handleVolumeToggle: () => void;
    isPlaying: boolean;
    isShuffle: boolean;
    loop: ILoop;
    shufflePlaylist: () => void;
    volume: AudioVolume;
}

export interface NedPlayerProviderProps {
    children: ReactNode;
    playlist: Playlist;
}

export interface ITrack {
    artist?: string;
    audioSrc: string;
    coverSrc?: string;
    title?: string;
}

export interface IDTrack extends ITrack {
    id: string;
}

// Either an array of tracks or array of audio src
export type Playlist = ITrack[] | IDTrack[] | string[];

export type CurrentTrack = OrNull<IDTrack>;

export enum ILoop {
    None,
    Playlist,
    Track,
}

export enum GlobalStylesPayload {
    Enable = 'enable',
    Disable = 'disable',
}

export enum DraggingElement {
    Progress = 'progress',
    Volume = 'volume',
}
