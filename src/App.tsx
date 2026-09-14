import type { FC } from 'react';
import { NedPlayerProvider } from './lib/NedPlayerContext';
import Playground from './Playground';
import song1 from './assets/song1.flac';
import song2 from './assets/song2.flac';
import song3 from './assets/song3.flac';
import song4 from './assets/song4.mp3';
import { ITrack } from './lib/types';

const App: FC = () => {
    const localPlaylist: ITrack[] = [
        {
            artist: 'AC/DC',
            audioSrc: song1,
            coverSrc: 'https://static-assets.s3web.39george.ru/go-beats/misc/5a350831230942d4e2cd4e43021f2c98:demoCover2.jpg',
            title: 'Highway to hell',
        },
        {
            artist: 'OST Attack on Titan',
            audioSrc: song2,
            title: 'APETITAN',
        },
        {
            artist: 'Avenged Sevenfold',
            audioSrc: song3,
            coverSrc: 'https://static-assets.s3web.39george.ru/go-beats/misc/7181a8f843fcc462418680152b84d459:demoCover4.jpg',
            title: 'Natural born killer',
        },
        {
            artist: 'Toby Fox',
            audioSrc: song4,
            title: 'MEGALOVANIA',
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
