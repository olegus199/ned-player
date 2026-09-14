import { FC, useRef } from 'react';
import useSliderDrag from '../hooks/useSliderDrag';
import { useNedPlayerContext } from '../NedPlayerContext';
import useProgressBarResizeObserver from '../hooks/useProgressBarResizeObserver';

const ProgressBar: FC = () => {
    const { handleCurrentTimeChange } = useNedPlayerContext();

    const progressWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressThumbRef = useRef<HTMLDivElement>(null);

    const { dragging } = useSliderDrag(progressWrapRef, handleCurrentTimeChange);
    useProgressBarResizeObserver(progressWrapRef, progressFillRef, progressThumbRef);

    return (
        <div
            ref={progressWrapRef}
            className='ned-player__progress-bar'
        >
            <div
                className='ned-player__progress-thumb'
                onClick={(e) => e.stopPropagation()}
                ref={progressThumbRef}
                style={{
                    cursor: dragging ? 'grabbing' : 'grab',
                }}
            />
            <div
                ref={progressFillRef}
                className='ned-player__progress-fill'
            />
            <div className='ned-player__progress-track' />
        </div>
    );
};

export default ProgressBar;

