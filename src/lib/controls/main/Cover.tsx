import { FC } from 'react';
import { useNedPlayerContext } from '../../NedPlayerContext';
import { CoverProps } from '@/lib/types';
import { cssClassNames } from '@/lib/utils';

const Cover: FC<CoverProps> = ({ className }) => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <div className={cssClassNames('ned-player__cover', {}, className)}>
            {currentTrack?.coverSrc ? (
                <img draggable={false} src={currentTrack.coverSrc} />
            ) : (
                <div className='ned-player__cover-placeholder'>?</div>
            )}
        </div>
    );
};

export default Cover;
