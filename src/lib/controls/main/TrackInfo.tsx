import { FC } from 'react';
import { useNedPlayerContext } from '../../NedPlayerContext';
import { TrackInfoProps } from '@/lib/types';
import { cssClassNames } from '@/lib/utils';

const TrackInfo: FC<TrackInfoProps> = ({ className }) => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <div className={cssClassNames('ned-player__track-info', {}, className)}>
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
