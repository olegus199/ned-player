import { FC, useEffect, useRef, useState } from 'react';
import { useGlobalPlayerContext } from './NedPlayerContext';
import { ILoop, TrackSkipPayload, PlayPausePayload } from './types';
import './NedPlayerControls.scss';
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
    const volumeWrapRef = useRef<HTMLDivElement>(null);
    const volumeFillRef = useRef<HTMLDivElement>(null);
    const volumeThumbRef = useRef<HTMLDivElement>(null);

    const { dragging } = usePlayerControlsEventListeners(progressWrapRef, volumeWrapRef);
    usePlayerControlsResizeObserver(
        {
            progressWrapRef,
            progressFillRef,
            progressThumbRef,
        },
        {
            volumeWrapRef,
            volumeFillRef,
            volumeThumbRef,
        },
    );

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
                    }}
                />
                <div
                    ref={progressFillRef}
                    className='ned-player__progress-fill'
                />
                <div className='ned-player__progress-track' />
            </div>

            <div className='ned-player__control-buttons'>
                <button onClick={() => handleSkip(TrackSkipPayload.Previous)}>prev song</button>
                <button onClick={() => handlePlayPause(isPlaying ? PlayPausePayload.Pause : PlayPausePayload.Play)}>
                    {isPlaying ? 'pause' : 'play'}
                </button>
                <button onClick={() => handleStop()}>stop</button>
                <button onClick={() => handleSkip(TrackSkipPayload.Next)}>next song</button>
                <button onClick={handleLoopChange}>{loopText}</button>
                <button onClick={shufflePlaylist}>{isShuffle ? 'Unshuffle' : 'Shuffle'}</button>
            </div>

            <div className='ned-player__volume-container'>
                <p>Volume: </p>
                <div
                    className='ned-player__volume-wrap'
                    ref={volumeWrapRef}
                >
                    <div
                        className='ned-player__volume-thumb'
                        ref={volumeThumbRef}
                        style={{
                            cursor: dragging ? 'grabbing' : 'grab',
                        }}
                    />
                    <div
                        className='ned-player__volume-fill'
                        ref={volumeFillRef}
                    />
                    <div className='ned-player__volume-track' />
                </div>
            </div>


            <div>{currentTrack?.title || 'Unkown track'} by {currentTrack?.artist || 'Unkown author'}</div>
            <div>{formattedTime} -- {formattedDuration}</div>
        </div>
    )
};

export default NedPlayerControls;
