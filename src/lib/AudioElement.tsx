import { FC } from 'react';
import { AudioElementProps } from './types';
import { useGlobalPlayerContext } from './NedPlayerContext';

const AudioElement: FC<AudioElementProps> = ({ ref }) => {
    const { currentTrack } = useGlobalPlayerContext();

    return (
        <audio
            ref={ref}
            style={{ display: 'none' }}
            src={currentTrack?.audioSrc}
        />
    );
};

export default AudioElement;
