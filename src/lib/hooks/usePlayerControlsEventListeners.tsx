import { RefObject, useEffect, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { useGlobalPlayerContext } from '../NedPlayerContext';
import { setGlobalStyles } from '../utils';
import { GlobalStylesPayload, OrNull } from '../types';

const usePlayerControlsEventListeners = (progressWrapRef: RefObject<OrNull<HTMLDivElement>>) => {
    const {
        handleCurrentTimeChange,
        isPlaying
    } = useGlobalPlayerContext();

    const [dragging, setDragging] = useState(false);

    function handleProgressWrapTouchStart(e: TouchEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.touches[0].clientX);
    }

    function handleProgressWrapMouseDown(e: MouseEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.clientX);
    }

    function handleTouchClickStart(clientX: number): void {
        setGlobalStyles(GlobalStylesPayload.Disable);
        setDragging(true);

        calcNewCurrentTime(clientX);
    }

    function handlePlayheadClickTouchEnd(): void {
        setGlobalStyles(GlobalStylesPayload.Enable);
        setDragging(false);
    }

    function handleTouchMove(e: TouchEvent): void {
        e.preventDefault();
        calcNewCurrentTime(e.touches[0].clientX);
    }

    function handleMouseMove(e: MouseEvent): void {
        e.preventDefault();
        calcNewCurrentTime(e.clientX);
    }

    function calcNewCurrentTime(clientX: number): void {
        const container = progressWrapRef.current;

        if (!container) {
            return;
        }

        const { left, width } = container.getBoundingClientRect();
        const offsetX = clientX - left;
        const ratio = offsetX / width;

        handleCurrentTimeChange(ratio);
    }

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('mouseup', handlePlayheadClickTouchEnd);
            document.addEventListener('touchend', handlePlayheadClickTouchEnd);
        }

        progressWrapRef.current?.addEventListener('touchstart', handleProgressWrapTouchStart, { passive: false });

        if (!isMobile || !isTablet) {
            progressWrapRef.current?.addEventListener('mousedown', handleProgressWrapMouseDown);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handlePlayheadClickTouchEnd);
            document.removeEventListener('touchend', handlePlayheadClickTouchEnd);
            progressWrapRef.current?.removeEventListener('touchstart', handleProgressWrapTouchStart);
            progressWrapRef.current?.removeEventListener('mousedown', handleProgressWrapMouseDown);
        };

    }, [dragging, isPlaying, isMobile, isTablet]);

    return { dragging };
};

export default usePlayerControlsEventListeners;
