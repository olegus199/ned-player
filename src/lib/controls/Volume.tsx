import { FC, useRef } from 'react';
import useVolumeResizeObserver from '../hooks/useVolumeResizeObserver';
import useSliderDrag from '../hooks/useSliderDrag';
import { useNedPlayerContext } from '../NedPlayerContext';
import iconVolume from '@/assets/icons/volume.svg?react';
import iconVolumeOff from '@/assets/icons/volume-off.svg?react';
import ControlButton from './ControlButton';
import { IconSize } from '../types';

const Volume: FC = () => {
    const {
        handleVolumeChange,
        handleVolumeToggle,
        volume,
    } = useNedPlayerContext();

    const volumeWrapRef = useRef<HTMLDivElement>(null);
    const volumeFillRef = useRef<HTMLDivElement>(null);
    const volumeThumbRef = useRef<HTMLDivElement>(null);

    const { dragging } = useSliderDrag(volumeWrapRef, handleVolumeChange);
    useVolumeResizeObserver(volumeWrapRef, volumeFillRef, volumeThumbRef);

    const currentVolumeIcon = volume === 0 ? iconVolumeOff : iconVolume;

    return (
        <div className='ned-player__volume'>
            <ControlButton icon={currentVolumeIcon} iconSize={IconSize.MD} onClick={handleVolumeToggle} />
            <div
                className='ned-player__volume-bar'
                ref={volumeWrapRef}
            >
                <div
                    className='ned-player__volume-thumb'
                    ref={volumeThumbRef}
                    style={{
                        cursor: dragging ? 'grabbing' : 'grab',
                    }}
                />
                <div
                    className='ned-player__volume-fill'
                    ref={volumeFillRef}
                />
                <div className='ned-player__volume-track' />
            </div>
        </div>
    );
};

export default Volume;
