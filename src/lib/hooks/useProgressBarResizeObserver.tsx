import { RefObject, useEffect } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';
import { OrNull } from '../types';

const useProgressBarResizeObserver = (
    progressWrapRef: RefObject<OrNull<HTMLDivElement>>,
    progressFillRef: RefObject<OrNull<HTMLDivElement>>,
    progressThumbRef: RefObject<OrNull<HTMLDivElement>>,
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

            if (!progressWrap
                || !fill
                || !thumb
                || audioTime === undefined
                || !audioDuration
            ) {
                return;
            }

            const containerWidth = progressWrap.getBoundingClientRect().width;
            const passedPersantage = Math.min(
                Math.max(0, (audioTime / audioDuration) * 100),
                100,
            );
            const updatedTranslate = (containerWidth * passedPersantage) / 100;

            fill.style.width = `${passedPersantage}%`;
            thumb.style.transform = `translateY(-50%) translateX(${updatedTranslate}px)`;
        });

        if (progressWrapRef.current) {
            observer.observe(progressWrapRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [audioTime, currentTrack, audioDuration]);
};

export default useProgressBarResizeObserver;
