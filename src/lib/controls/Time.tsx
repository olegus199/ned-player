import { FC } from 'react';
import { useNedPlayerContext } from '../NedPlayerContext';

const Time: FC = () => {
    const { formattedDuration, formattedTime } = useNedPlayerContext();
    return (
        <div className='ned-player__time'>
            <div>
                {formattedTime}
            </div>
            <div>
                {formattedDuration}
            </div>
        </div>
    );
};

export default Time;
