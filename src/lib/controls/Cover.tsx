import { FC } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';

const Cover: FC = () => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <div className='ned-player__cover'>
            {currentTrack?.coverSrc ? (
                <img draggable={false} src={currentTrack.coverSrc} />
            ) : (
                <div className='ned-player__cover-placeholder'>?</div>
            )}
        </div>
    );
};

export default Cover;
