import { RefObject, useEffect } from 'react';
import { useGlobalPlayerContext } from '../NedPlayerContext';
import { OrNull } from '../types';

const usePlayerControlsResizeObserver = (
    progressRefs: {
        progressWrapRef: RefObject<OrNull<HTMLDivElement>>,
        progressFillRef: RefObject<OrNull<HTMLDivElement>>,
        progressThumbRef: RefObject<OrNull<HTMLDivElement>>,
    },
    volumeRefs: {
        volumeWrapRef: RefObject<OrNull<HTMLDivElement>>,
        volumeFillRef: RefObject<OrNull<HTMLDivElement>>,
        volumeThumbRef: RefObject<OrNull<HTMLDivElement>>,
    },
) => {
    const {
        audioDuration,
        audioTime,
        currentTrack,
        volume,
    } = useGlobalPlayerContext();

    const { progressWrapRef, progressFillRef, progressThumbRef } = progressRefs;
    const { volumeWrapRef, volumeFillRef, volumeThumbRef } = volumeRefs;

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const progressWrap = progressWrapRef.current;
            const fill = progressFillRef.current;
            const thumb = progressThumbRef.current;

            if (!progressWrap ||
                !fill ||
                !thumb ||
                audioTime === undefined ||
                !audioDuration
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

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const volumeWrap = volumeWrapRef.current;
            const fill = volumeFillRef.current;
            const thumb = volumeThumbRef.current;

            if (!volumeWrap
                || !fill
                || !thumb
                || volume === undefined
            ) {
                return;
            }

            const containerWidth = volumeWrap.getBoundingClientRect().width;
            const percent = volume * 100;
            const updatedTranslate = (containerWidth * percent) / 100;

            fill.style.width = `${percent}%`;
            thumb.style.transform = `translateY(-50%) translateX(${updatedTranslate}px)`;
        });

        if (volumeWrapRef.current) {
            observer.observe(volumeWrapRef.current);
        }

        return () => {
            observer.disconnect();
        };

    }, [volume]);
};

export default usePlayerControlsResizeObserver;
