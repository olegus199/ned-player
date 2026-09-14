import { RefObject, useEffect, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { setGlobalStyles } from '../utils';
import { ComposedDragEvent, GlobalStylesPayload, OrNull } from '../types';
import { useNedPlayerContext } from '../NedPlayerContext';

const useSliderDrag = (
    wrapRef: RefObject<OrNull<HTMLDivElement>>,
    onChange: (newTime: number) => void,
) => {
    const { currentTrack } = useNedPlayerContext();

    const [dragging, setDragging] = useState(false);

    // Prevent continious dragging when track changes (when user drags to the end of a track)
    useEffect(() => {
        handleEnd();
    }, [currentTrack?.id]);

    useEffect(() => {
        if (dragging) {
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchend', handleEnd);
        }

        if (!isMobile && !isTablet) {
            wrapRef.current?.addEventListener('mousedown', handleStart);
        } else {
            wrapRef.current?.addEventListener('touchstart', handleStart, { passive: false });
        }

        return () => {
            if (dragging) {
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchend', handleEnd);
            }

            wrapRef.current?.removeEventListener('touchstart', handleStart);
            wrapRef.current?.removeEventListener('mousedown', handleStart);
        };

    }, [dragging, isMobile, isTablet]);

    function handleStart(e: ComposedDragEvent): void {
        e.preventDefault();

        setGlobalStyles(GlobalStylesPayload.Disable);
        setDragging(true);

        onChange(calcRatio(e));
    }

    function handleEnd(): void {
        setGlobalStyles(GlobalStylesPayload.Enable);
        setDragging(false);
    }

    function handleMove(e: ComposedDragEvent): void {
        e.preventDefault();

        onChange(calcRatio(e));
    }

    function calcRatio(e: ComposedDragEvent): number {
        const container = wrapRef.current;

        if (!container) {
            return 0;
        }

        let clientX = 0;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else if ('clientX' in e) {
            clientX = e.clientX;
        }

        const { left, width } = container.getBoundingClientRect();
        const offsetX = clientX - left;

        return Math.max(0, Math.min(1, offsetX / width));
    }

    return { dragging };
};

export default useSliderDrag;
