import { FC } from 'react';
import './NedPlayerControls.scss';
import Cover from './main/Cover';
import TrackInfo from './main/TrackInfo';
import ProgressBar from './main/ProgressBar';
import Time from './main/Time';
import ControlButtons from './main/ControlButtons';
import Volume from './main/Volume';
import ControlButton from './main/ControlButton';
import DefaultLayout from './layouts/DefaultLayout';
import FixedLayout from './layouts/FixedLayout';
import { LayoutType, NedPlayerControlsProps } from '../types';

const layouts: Record<LayoutType, FC> = {
    default: DefaultLayout,
    fixed: FixedLayout,
};

const NedPlayerControlsRoot: FC<NedPlayerControlsProps> = ({
    children,
    layoutType = LayoutType.Default,
}) => {
    const LayoutComponent = layouts[layoutType];

    return (
        <div className={`ned-player${layoutType === LayoutType.Fixed ? ' ned-player--fixed' : ''}`}>
            {children ?? <LayoutComponent />}
        </div>
    );
};

const NedPlayerControls = Object.assign(NedPlayerControlsRoot, {
    Cover,
    TrackInfo,
    ProgressBar,
    Time,
    ControlButtons,
    ControlButton,
    Volume,
    DefaultLayout,
    FixedLayout,
});

export default NedPlayerControls;
