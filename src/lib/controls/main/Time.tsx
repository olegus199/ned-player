import { FC } from 'react';
import { useNedPlayerContext } from '../../NedPlayerContext';
import { TimeProps } from '@/lib/types';

const Time: FC<TimeProps> = ({
    children,
}) => {
    const { formattedDuration, formattedTime } = useNedPlayerContext();
    return (
        <div className='ned-player__time'>
            <div>
                {formattedTime}
            </div>
            {children ? (
                <div className='ned-player__time-children'>
                    {children}
                </div>
            ) : null}
            <div>
                {formattedDuration}
            </div>
        </div>
    );
};

export default Time;
