import { RefObject, useEffect } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';
import { OrNull } from '../types';

const useVolumeResizeObserver = (
    volumeWrapRef: RefObject<OrNull<HTMLDivElement>>,
    volumeFillRef: RefObject<OrNull<HTMLDivElement>>,
    volumeThumbRef: RefObject<OrNull<HTMLDivElement>>,
) => {
    const { volume } = useNedPlayerContext();

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

export default useVolumeResizeObserver;
