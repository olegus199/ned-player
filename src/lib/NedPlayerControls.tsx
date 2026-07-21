import { FC, useEffect, useRef, useState } from 'react';
import { useGlobalPlayerContext } from './NedPlayerContext';
import { ILoop, TrackSkipPayload, PlayPausePayload } from './types';
import './NedPlayerControls.css';

const NedPlayerControls: FC = () => {
    const {
        audioDuration,
        audioTime,
        currentTrack,
        handleCurrentTimeChange,
        handleLoopChange,
        handlePlayPause,
        handleSkip,
        handleStop,
        isShuffle,
        loop,
        shufflePlaylist,
    } = useGlobalPlayerContext();

    const [dragging, setDragging] = useState(false);
    const [loopText, setLoopText] = useState('');

    const progressWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressThumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            const progressWrap = progressWrapRef.current;
            const fill = progressFillRef.current;
            const thumb = progressThumbRef.current;

            if (
                !progressWrap ||
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
    }, [audioTime, dragging, currentTrack, audioDuration]);

    useEffect(() => {
        let text = '';

        switch (loop) {
            case ILoop.None:
                text = 'No loop';
                break;
            case ILoop.Playlist:
                text = 'Loop playlist';
                break;
            case ILoop.Track:
                text = 'Loop track';
                break;
            default:
                text = 'Unkown option for a loop';
        }

        setLoopText(text);
    }, [loop]);

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

    function handlePBContainerMouseDown(e: MouseEvent): void {
        e.preventDefault();

        // setGlobalStyles('disable');
        setDragging(true);
        calcNewCurrentTime(e.clientX);
    }

    function handlePlayheadClickTouchEnd(): void {
        // setGlobalStyles('enable');
        setDragging(false);
        // if (isSafari) {
        //     handlePlayPause(PlayPausePayload.Play);
        // }
    }

    useEffect(() => {
        if (dragging) {
            // document.addEventListener('mousemove', handleMouseMove);
            // document.addEventListener('touchmove', handleTouchMove, {
            //     passive: false,
            // });
            document.addEventListener('mouseup', handlePlayheadClickTouchEnd);
            document.addEventListener('touchend', handlePlayheadClickTouchEnd);
        }

        // progressBarRefs.container.current?.addEventListener(
        //     'touchstart',
        //     handlePBContainerTouchStart,
        //     { passive: false },
        // );

        progressWrapRef.current?.addEventListener('mousedown', handlePBContainerMouseDown);
        // if (!isMobile || !isTablet) {
        //     progressBarRefs.container.current?.addEventListener(
        //         'mousedown',
        //         handlePBContainerMouseDown,
        //     );
        // }

        return () => {
            // document.removeEventListener('mousemove', handleMouseMove);
            // document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handlePlayheadClickTouchEnd);
            document.removeEventListener('touchend', handlePlayheadClickTouchEnd);
            // progressBarRefs.container.current?.removeEventListener(
            //     'touchstart',
            //     handlePBContainerTouchStart,
            // );
            // progressBarRefs.container.current?.removeEventListener(
            //     'mousedown',
            //     handlePBContainerMouseDown,
            // );
        };
    }, [dragging]);

    return (
        <div className='ned-player'>
            <div
                ref={progressWrapRef}
                className='ned-player__progress-wrap'
            >
                <div
                    className='ned-player__progress-thumb'
                    onClick={(e) => e.stopPropagation()}
                    ref={progressThumbRef}
                    style={{
                        cursor: dragging ? 'grabbing' : 'grab',
                        opacity: dragging ? 1 : '',
                    }}
                />
                <div
                    ref={progressFillRef}
                    className='ned-player__progress-fill'
                />
                <div className='ned-player__progress-track' />
            </div>

            <div className='buttons-container'>
                <button onClick={() => handleSkip(TrackSkipPayload.Previous)}>prev song</button>
                <button onClick={() => handlePlayPause(PlayPausePayload.Play)}>play</button>
                <button onClick={() => handlePlayPause(PlayPausePayload.Pause)}>pause</button>
                <button onClick={() => handleStop()}>stop</button>
                <button onClick={() => handleSkip(TrackSkipPayload.Next)}>next song</button>
                <button onClick={handleLoopChange}>{loopText}</button>
                <button onClick={shufflePlaylist}>{isShuffle ? 'Unshuffle' : 'shuffle'}</button>
            </div>
            <div>{currentTrack?.title || 'Unkown track'} by {currentTrack?.artist || 'Unkown author'}</div>
            <div>Time: {Math.floor(audioTime || 0)}</div>
        </div>
    )
};

export default NedPlayerControls;
