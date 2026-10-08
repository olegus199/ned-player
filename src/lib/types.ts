import { FC, ReactNode, RefObject, SVGProps } from 'react';

export type OrUndefined<T> = T | undefined;

export type OrNull<T> = T | null;

export type AudioRef = RefObject<OrNull<HTMLAudioElement>>;

export enum PlayPausePayload {
    Play = 'play',
    Pause = 'pause',
}

export enum TrackSkipPayload {
    Next = 'next',
    Previous = 'previous',
}

export type AudioTime = OrUndefined<number>;

export type AudioVolume = number;

export type DragRatio = OrNull<number>;

export interface NedPlayerContextValue {
    currentTrack: CurrentTrack;
    handleLoopChange: () => void;
    handlePlayPause: (payload: PlayPausePayload) => void;
    handleSeek: (ratio: number) => void;
    handleSkip: (payload: TrackSkipPayload) => void;
    handleStop: () => void;
    handleVolumeChange: (newVolume: number) => void;
    handleVolumeToggle: () => void;
    isPlaying: boolean;
    isShuffle: boolean;
    loop: ILoop;
    shufflePlaylist: () => void;
    volume: AudioVolume;
}

export interface NedPlayerTimeContextValue {
    audioDuration: number;
    audioTime: number;
    formattedDuration: string;
    formattedTime: string;
}

export interface NedPlayerProviderProps {
    children: ReactNode;
    playlist: Playlist;
}

export interface NedPlayerTimeProviderProps {
    audioRef: AudioRef;
    children: ReactNode;
}

export interface Shortcuts {
    togglePlay: () => void;
    toggleMute: () => void;
}

export interface AudioEngineOptions {
    src?: string;
    onEnded: () => void;
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

export interface ClassComposeItem {
    [key: string]: OrNull<boolean | undefined>;
}

export type ComposedDragEvent = TouchEvent | MouseEvent;

export interface BasePlayerControlsProps {
    className?: string;
}

export interface ControlButtonProps {
    className?: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    iconSize?: IconSize;
    isActive?: boolean;
    onClick?: () => void;
}

export enum IconSize {
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
}

export enum LayoutType {
    Default = 'default',
    Fixed = 'fixed',
}

export interface NedPlayerControlsProps {
    children?: ReactNode;
    layoutType?: LayoutType;
}

export interface TrackInfoProps extends BasePlayerControlsProps { }

export interface CoverProps extends BasePlayerControlsProps { }

export interface TimeProps extends BasePlayerControlsProps {
    children?: ReactNode;
}

export interface VolumeProps extends BasePlayerControlsProps { }

export interface ControlButtonsProps extends BasePlayerControlsProps { }
