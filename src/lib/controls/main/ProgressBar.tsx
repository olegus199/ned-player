import { FC, useRef } from 'react';
import useSliderDrag from '../../hooks/useSliderDrag';
import { useNedPlayerContext } from '../../NedPlayerContext';
import { useNedPlayerTime } from '../../NedPlayerTimeContext';

const ProgressBar: FC = () => {
    const { handleSeek } = useNedPlayerContext();
    const { audioTime, audioDuration } = useNedPlayerTime();

    const progressWrapRef = useRef<HTMLDivElement>(null);
    const { dragging, dragRatio } = useSliderDrag(progressWrapRef, handleSeek);

    // Drag position takes priority; otherwise use the real playback time
    const ratio = dragRatio ?? (audioDuration ? audioTime / audioDuration : 0);
    const percent = Math.min(Math.max(ratio * 100, 0), 100);

    return (
        <div
            ref={progressWrapRef}
            className='ned-player__progress-bar'
            style={{ cursor: dragging ? 'grabbing' : 'pointer' }}
        >
            <div
                className='ned-player__progress-thumb'
                onClick={(e) => e.stopPropagation()}
                style={{ left: `${percent}%` }}
            />
            <div
                className='ned-player__progress-fill'
                style={{ width: `${percent}%` }}
            />
            <div className='ned-player__progress-track' />
        </div>
    );
};

export default ProgressBar;
