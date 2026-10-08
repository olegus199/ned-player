import { FC, useRef } from 'react';
import useSliderDrag from '../../hooks/useSliderDrag';
import { useNedPlayerContext } from '../../NedPlayerContext';
import useProgressBarResizeObserver from '../../hooks/useProgressBarResizeObserver';

const ProgressBar: FC = () => {
    const { handleSeek } = useNedPlayerContext();

    const progressWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressThumbRef = useRef<HTMLDivElement>(null);

    const { dragging, dragRatio } = useSliderDrag(progressWrapRef, handleSeek);
    useProgressBarResizeObserver(progressWrapRef, progressFillRef, progressThumbRef, dragRatio);

    return (
        <div
            ref={progressWrapRef}
            className='ned-player__progress-bar'
            style={{
                cursor: dragging ? 'grabbing' : 'pointer',
            }}
        >
            <div
                className='ned-player__progress-thumb'
                onClick={(e) => e.stopPropagation()}
                ref={progressThumbRef}
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

