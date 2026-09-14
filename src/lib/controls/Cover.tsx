import { FC } from 'react';
import { cssClassNames } from '../utils';
import { useNedPlayerContext } from '../NedPlayerContext';

const Cover: FC = () => {
    const { currentTrack } = useNedPlayerContext();

    return (
        <div className={cssClassNames('ned-player__cover', {
            ['ned-player__cover--placeholder']: !currentTrack?.coverSrc
        })}>
            {currentTrack?.coverSrc && (
                <img draggable={false} src={currentTrack.coverSrc} />
            )}
        </div>
    );
};

export default Cover;
