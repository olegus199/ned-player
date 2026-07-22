import { RefObject, useEffect, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { useGlobalPlayerContext } from '../NedPlayerContext';
import { setGlobalStyles } from '../utils';
import { DraggingElement, GlobalStylesPayload, OrNull } from '../types';

const usePlayerControlsEventListeners = (
    progressWrapRef: RefObject<OrNull<HTMLDivElement>>,
    volumeWrapRef: RefObject<OrNull<HTMLDivElement>>
) => {
    const { handleCurrentTimeChange, handleVolumeChange } = useGlobalPlayerContext();

    const [draggingElement, setDraggingElement] = useState<OrNull<DraggingElement>>(null);

    function handleProgressWrapTouchStart(e: TouchEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.touches[0].clientX, DraggingElement.Progress);
    }

    function handleProgressWrapMouseDown(e: MouseEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.clientX, DraggingElement.Progress);
    }

    function handleVolumeWrapTouchStart(e: TouchEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.touches[0].clientX, DraggingElement.Volume);
    }

    function handleVolumeWrapMouseDown(e: MouseEvent): void {
        e.preventDefault();
        handleTouchClickStart(e.clientX, DraggingElement.Volume);
    }

    function handleTouchClickStart(clientX: number, element: DraggingElement): void {
        setGlobalStyles(GlobalStylesPayload.Disable);
        setDraggingElement(element);

        switch (element) {
            case DraggingElement.Progress:
                calcNewCurrentTime(clientX);
                break;
            case DraggingElement.Volume:
                calcNewVolume(clientX);
                break;
        }
    }

    function handlePlayheadClickTouchEnd(): void {
        setGlobalStyles(GlobalStylesPayload.Enable);
        setDraggingElement(null);
    }

    function handleTouchMove(e: TouchEvent): void {
        e.preventDefault();

        switch (draggingElement) {
            case DraggingElement.Progress:
                calcNewCurrentTime(e.touches[0].clientX);
                break;
            case DraggingElement.Volume:
                calcNewVolume(e.touches[0].clientX);
                break;
        }
    }

    function handleMouseMove(e: MouseEvent): void {
        e.preventDefault();

        switch (draggingElement) {
            case DraggingElement.Progress:
                calcNewCurrentTime(e.clientX);
                break;
            case DraggingElement.Volume:
                calcNewVolume(e.clientX);
                break;
        }
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

    function calcNewVolume(clientX: number): void {
        const container = volumeWrapRef.current;

        if (!container) {
            return;
        }

        const { left, width } = container.getBoundingClientRect();

        const offsetX = clientX - left;
        const ratio = Math.max(0, Math.min(1, offsetX / width));

        handleVolumeChange(ratio);
    }

    useEffect(() => {
        if (draggingElement) {
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handlePlayheadClickTouchEnd);
            document.addEventListener('touchend', handlePlayheadClickTouchEnd);
        }

        progressWrapRef.current?.addEventListener('touchstart', handleProgressWrapTouchStart, { passive: false });
        volumeWrapRef.current?.addEventListener('touchstart', handleVolumeWrapTouchStart, { passive: false });

        if (!isMobile || !isTablet) {
            progressWrapRef.current?.addEventListener('mousedown', handleProgressWrapMouseDown);
            volumeWrapRef.current?.addEventListener('mousedown', handleVolumeWrapMouseDown);
        }

        return () => {
            if (draggingElement) {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handlePlayheadClickTouchEnd);
                document.removeEventListener('touchend', handlePlayheadClickTouchEnd);
            }

            progressWrapRef.current?.removeEventListener('touchstart', handleProgressWrapTouchStart);
            progressWrapRef.current?.removeEventListener('mousedown', handleProgressWrapMouseDown);
            volumeWrapRef.current?.removeEventListener('touchstart', handleVolumeWrapTouchStart);
            volumeWrapRef.current?.removeEventListener('mousedown', handleVolumeWrapMouseDown);
        };

    }, [draggingElement, isMobile, isTablet]);

    return { dragging: !!draggingElement };
};

export default usePlayerControlsEventListeners;
