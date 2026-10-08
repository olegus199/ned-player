import { RefObject, useEffect } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';
import { DragRatio, OrNull } from '../types';

const useProgressBarResizeObserver = (
    progressWrapRef: RefObject<OrNull<HTMLDivElement>>,
    progressFillRef: RefObject<OrNull<HTMLDivElement>>,
    progressThumbRef: RefObject<OrNull<HTMLDivElement>>,
    dragRatio: DragRatio,
) => {
    const {
        audioDuration,
        audioTime,
        currentTrack,
    } = useNedPlayerContext();

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const progressWrap = progressWrapRef.current;
            const fill = progressFillRef.current;
            const thumb = progressThumbRef.current;

            if (!progressWrap || !fill || !thumb) {
                return;
            }

            // Drag position takes priority; otherwise use the real playback time
            const ratio = dragRatio
                ?? (audioTime !== undefined && audioDuration ? audioTime / audioDuration : null);

            if (ratio === null) {
                return;
            }

            const passedPercentage = Math.min(Math.max(0, ratio * 100), 100);
            const containerWidth = progressWrap.getBoundingClientRect().width;
            const updatedTranslate = (containerWidth * passedPercentage) / 100;

            fill.style.width = `${passedPercentage}%`;
            thumb.style.transform = `translateY(-50%) translateX(${updatedTranslate}px)`;
        });

        if (progressWrapRef.current) {
            observer.observe(progressWrapRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [audioTime, currentTrack, audioDuration, dragRatio]);
};

export default useProgressBarResizeObserver;
