import { FC } from 'react';
import { AudioElementProps } from './types';
import { useNedPlayerContext } from './NedPlayerContext';

const AudioElement: FC<AudioElementProps> = ({ ref }) => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <audio
            ref={ref}
            style={{ display: 'none' }}
            src={currentTrack?.audioSrc}
        />
    );
};

export default AudioElement;
