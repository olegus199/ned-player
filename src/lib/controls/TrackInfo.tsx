import { FC } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';

const TrackInfo: FC = () => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <div className='ned-player__track-info'>
            <div className='ned-player__track-title'>
                {currentTrack?.title || 'Unknown track'}
            </div>
            <div className='ned-player__track-artist'>
                {currentTrack?.artist || 'Unknown artist'}
            </div>
        </div>
    );
};

export default TrackInfo;
