import { RefObject, useEffect, useRef, useState } from 'react';
import { setGlobalStyles } from '../utils';
import { DragRatio, GlobalStylesPayload, OrNull } from '../types';
import { useNedPlayerContext } from '../NedPlayerContext';

const useSliderDrag = (
    wrapRef: RefObject<OrNull<HTMLDivElement>>,
    onCommit: (ratio: number) => void,
) => {
    const { currentTrack } = useNedPlayerContext();
    const [dragRatio, setDragRatio] = useState<DragRatio>(null);
    const ratioRef = useRef<DragRatio>(null);

    // Always call the latest onCommit without re-binding listeners
    const onCommitRef = useRef(onCommit);
    onCommitRef.current = onCommit;

    const setRatio = (ratio: DragRatio) => {
        ratioRef.current = ratio;
        setDragRatio(ratio);
    };

    // If the track changes mid-drag, cancel instead of seeking the new track
    useEffect(() => {
        if (ratioRef.current !== null) {
            setGlobalStyles(GlobalStylesPayload.Enable);
            setRatio(null);
        }
    }, [currentTrack?.id]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const calc = (clientX: number) => {
            const { left, width } = el.getBoundingClientRect();
            return Math.max(0, Math.min(1, (clientX - left) / width));
        };

        const onDown = (e: PointerEvent) => {
            e.preventDefault();
            el.setPointerCapture(e.pointerId);
            setGlobalStyles(GlobalStylesPayload.Disable);
            setRatio(calc(e.clientX));
        };

        const onMove = (e: PointerEvent) => {
            if (ratioRef.current === null) return;
            setRatio(calc(e.clientX));
        };

        const onUp = () => {
            if (ratioRef.current === null) return;
            onCommitRef.current(ratioRef.current);
            setGlobalStyles(GlobalStylesPayload.Enable);
            setRatio(null);
        };

        const onCancel = () => {
            setGlobalStyles(GlobalStylesPayload.Enable);
            setRatio(null);
        };

        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onCancel);

        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onCancel);
        };
    }, []);

    return { dragRatio, dragging: dragRatio !== null };
};

export default useSliderDrag;
