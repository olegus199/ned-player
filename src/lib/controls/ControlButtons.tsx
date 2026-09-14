import { FC } from 'react';
import iconPause from '@/assets/icons/pause.svg?react';
import iconPlay from '@/assets/icons/play.svg?react';
import iconShuffle from '@/assets/icons/shuffle.svg?react';
import iconLoop from '@/assets/icons/loop.svg?react';
import iconLoopPlaylist from '@/assets/icons/loop-playlist.svg?react';
import iconLoopTrack from '@/assets/icons/loop-track.svg?react';
import iconSkipLeft from '@/assets/icons/skip-left.svg?react';
import iconSkipRight from '@/assets/icons/skip-right.svg?react';
import { useNedPlayerContext } from '../NedPlayerContext';
import { IconSize, ILoop, PlayPausePayload, TrackSkipPayload } from '../types';
import ControlButton from './ControlButton';

const ControlButtons: FC = () => {
    const {
        handleLoopChange,
        handlePlayPause,
        handleSkip,
        isPlaying,
        shufflePlaylist,
        isShuffle,
        loop,
    } = useNedPlayerContext();

    let currentLoopIcon = iconLoop;

    switch (loop) {
        case ILoop.None:
            currentLoopIcon = iconLoop;
            break;
        case ILoop.Playlist:
            currentLoopIcon = iconLoopPlaylist;
            break;
        case ILoop.Track:
            currentLoopIcon = iconLoopTrack;
            break;
    }

    return (
        <div className='ned-player__control-buttons'>
            <ControlButton
                icon={iconShuffle}
                isActive={isShuffle}
                onClick={shufflePlaylist}
            />

            <div className='ned-player__control-buttons-center'>
                <ControlButton icon={iconSkipLeft} onClick={() => handleSkip(TrackSkipPayload.Previous)} />
                <ControlButton
                    icon={isPlaying ? iconPause : iconPlay}
                    iconSize={IconSize.LG}
                    onClick={() => handlePlayPause(isPlaying ? PlayPausePayload.Pause : PlayPausePayload.Play)}
                />
                <ControlButton icon={iconSkipRight} onClick={() => handleSkip(TrackSkipPayload.Next)} />
            </div>

            <ControlButton
                icon={currentLoopIcon}
                isActive={loop !== ILoop.None}
                onClick={handleLoopChange}
            />
        </div>
    );
};

export default ControlButtons;
