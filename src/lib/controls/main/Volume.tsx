import { FC, useEffect, useRef } from 'react';
import useSliderDrag from '../../hooks/useSliderDrag';
import { useNedPlayerContext } from '../../NedPlayerContext';
import iconVolume from '@/assets/icons/volume.svg?react';
import iconVolumeOff from '@/assets/icons/volume-off.svg?react';
import ControlButton from './ControlButton';
import { IconSize, VolumeProps } from '../../types';
import { cssClassNames } from '@/lib/utils';

const Volume: FC<VolumeProps> = ({ className }) => {
    const {
        handleVolumeChange,
        handleVolumeToggle,
        volume,
    } = useNedPlayerContext();

    const volumeWrapRef = useRef<HTMLDivElement>(null);
    const { dragging, dragRatio } = useSliderDrag(volumeWrapRef, handleVolumeChange);

    // Live volume updates while dragging
    useEffect(() => {
        if (dragRatio !== null) {
            handleVolumeChange(dragRatio);
        }
    }, [dragRatio]);

    const percent = Math.min(Math.max(0, (volume ?? 0) * 100), 100);
    const currentVolumeIcon = volume === 0 ? iconVolumeOff : iconVolume;

    return (
        <div className={cssClassNames('ned-player__volume', {}, className)}>
            <ControlButton icon={currentVolumeIcon} iconSize={IconSize.MD} onClick={handleVolumeToggle} />
            <div
                className='ned-player__volume-bar'
                ref={volumeWrapRef}
                style={{ cursor: dragging ? 'grabbing' : 'pointer' }}
            >
                <div
                    className='ned-player__volume-thumb'
                    style={{ left: `${percent}%` }}
                />
                <div
                    className='ned-player__volume-fill'
                    style={{ width: `${percent}%` }}
                />
                <div className='ned-player__volume-track' />
            </div>
        </div>
    );
};

export default Volume;
