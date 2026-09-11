import type { FC } from 'react';
import { NedPlayerProvider } from './lib/NedPlayerContext';
import Playground from './Playground';
import song1 from './assets/song1.flac';
import song2 from './assets/song2.flac';
import song3 from './assets/song3.flac';
import song4 from './assets/song4.mp3';
import { ITrack } from './lib/types';

const App: FC = () => {
    const webPlaylist = [
        'https://static-assets.s3web.39george.ru/go-beats/misc/13a18ce88bcff7a9da1716e73577d883:demoSong1.flac',
        'https://static-assets.s3web.39george.ru/go-beats/misc/ecfe5c3b135b5658a105e697c4857efe:demoSong2.mp3',
        'https://static-assets.s3web.39george.ru/go-beats/misc/ddbb77f2fb7947c6b561fccbead0ce2c:demoSong3.mp3',
        'https://static-assets.s3web.39george.ru/go-beats/misc/c99fb5e099ef361a4f1f5cb7158428bc:demoSong4.mp3',
        'https://static-assets.s3web.39george.ru/go-beats/misc/ac2d83373b6b54e2221d545f0f3e7b40:demoSong5.mp3',
        'https://static-assets.s3web.39george.ru/go-beats/misc/fe62a449b85d4a516fb763f1c734b98b:demoSong6.mp3',
    ];
    const localPlaylist: ITrack[] = [
        {
            audioSrc: song1,
            title: 'Highway to hell',
            artist: 'AC/DC',
        },
        {
            audioSrc: song2,
            title: 'APETITAN',
            artist: 'OST Attack on Titan',
        },
        {
            audioSrc: song3,
            title: 'Natural born killer',
            artist: 'Avenged Sevenfold',
        },
        {
            audioSrc: song4,
            title: 'MEGALOVANIA',
            artist: 'Toby Fox',
        },
    ]

    return (
        <NedPlayerProvider playlist={localPlaylist}>
            <h1>NED player</h1>
            <Playground />
        </NedPlayerProvider>
    );
};

export default App;
