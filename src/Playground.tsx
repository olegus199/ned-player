import { FC } from 'react';
import { NedPlayerControls } from './lib';
import { LayoutType } from './lib/types';

const Playground: FC = () => {
    return (
        <>
            <NedPlayerControls />
            <NedPlayerControls layoutType={LayoutType.Fixed} />
        </>
    );
};

export default Playground;
