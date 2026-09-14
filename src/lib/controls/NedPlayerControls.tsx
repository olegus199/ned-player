import { FC, PropsWithChildren } from 'react';
import './NedPlayerControls.scss';
import Cover from './Cover';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import Time from './Time';
import ControlButtons from './ControlButtons';
import Volume from './Volume';
import ControlButton from './ControlButton';

const NedPlayerControlsRoot: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='ned-player'>
            {children ?? (
                <div className='ned-player__content'>
                    <Cover />

                    <div className='ned-player__right'>
                        <TrackInfo />
                        <div className='ned-player__main-controls'>
                            <div>
                                <div className='ned-player__timeline'>
                                    <ProgressBar />
                                    <Time />
                                </div>
                            </div>
                            <ControlButtons />
                        </div>

                        <Volume />
                    </div>
                </div>
            )}
        </div>
    )
};

const NedPlayerControls = Object.assign(NedPlayerControlsRoot, {
    Cover,
    TrackInfo,
    ProgressBar,
    Time,
    ControlButtons,
    ControlButton,
    Volume,
});

export default NedPlayerControls;
