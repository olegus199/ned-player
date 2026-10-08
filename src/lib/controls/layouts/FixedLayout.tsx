import { FC } from 'react';
import Cover from '../main/Cover';
import TrackInfo from '../main/TrackInfo';
import ProgressBar from '../main/ProgressBar';
import Time from '../main/Time';
import ControlButtons from '../main/ControlButtons';
import Volume from '../main/Volume';

const FixedLayout: FC = () => {
    return (
        <>
            <ProgressBar />
            <div className='ned-player-fixed__content'>
                <div className='ned-player-fixed__now-playing'>
                    <Cover className='ned-player-fixed__cover' />
                    <TrackInfo className='ned-player-fixed__track-info' />
                </div>
                <Time>
                    <ControlButtons className='ned-player-fixed__control-buttons' />
                </Time>
                <Volume className='ned-player-fixed__volume' />
            </div>
        </>
    );
};

export default FixedLayout;
