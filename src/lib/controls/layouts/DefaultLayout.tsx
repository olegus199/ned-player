import { FC } from 'react';
import Cover from '../main/Cover';
import TrackInfo from '../main/TrackInfo';
import ProgressBar from '../main/ProgressBar';
import Time from '../main/Time';
import ControlButtons from '../main/ControlButtons';
import Volume from '../main/Volume';

const DefaultLayout: FC = () => {
    return (
        <div className='ned-player-default__content'>
            <Cover />

            <div className='ned-player-default__right'>
                <TrackInfo />
                <div className='ned-player-default__main-controls'>
                    <div>
                        <div className='ned-player-default__timeline'>
                            <ProgressBar />
                            <Time />
                        </div>
                    </div>
                    <ControlButtons />
                </div>

                <Volume />
            </div>
        </div>
    );
};

export default DefaultLayout;
