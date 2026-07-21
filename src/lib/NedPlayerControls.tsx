import { FC, useEffect, useRef, useState } from 'react';
import { useGlobalPlayerContext } from './NedPlayerContext';
import { ILoop, TrackSkipPayload, PlayPausePayload } from './types';
import './NedPlayerControls.css';
import usePlayerControlsEventListeners from './hooks/usePlayerControlsEventListeners';
import usePlayerControlsResizeObserver from './hooks/usePlayerControlsResizeObserver';

const NedPlayerControls: FC = () => {
    const {
        currentTrack,
        formattedDuration,
        formattedTime,
        handleLoopChange,
        handlePlayPause,
        handleSkip,
        handleStop,
        isPlaying,
        isShuffle,
        loop,
        shufflePlaylist,
    } = useGlobalPlayerContext();

    const [loopText, setLoopText] = useState('');

    const progressWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const progressThumbRef = useRef<HTMLDivElement>(null);

    const { dragging } = usePlayerControlsEventListeners(progressWrapRef);
    usePlayerControlsResizeObserver(progressWrapRef, progressFillRef, progressThumbRef);

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
                <button onClick={() => handlePlayPause(isPlaying ? PlayPausePayload.Pause : PlayPausePayload.Play)}>
                    {isPlaying ? 'pause' : 'play'}
                </button>
                <button onClick={() => handleStop()}>stop</button>
                <button onClick={() => handleSkip(TrackSkipPayload.Next)}>next song</button>
                <button onClick={handleLoopChange}>{loopText}</button>
                <button onClick={shufflePlaylist}>{isShuffle ? 'Unshuffle' : 'shuffle'}</button>
            </div>
            <div>{currentTrack?.title || 'Unkown track'} by {currentTrack?.artist || 'Unkown author'}</div>
            <div>{formattedTime} -- {formattedDuration}</div>
        </div>
    )
};

export default NedPlayerControls;
