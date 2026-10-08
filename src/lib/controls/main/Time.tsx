import { FC } from 'react';
import { TimeProps } from '@/lib/types';
import { useNedPlayerTime } from '@/lib/NedPlayerTimeContext';

const Time: FC<TimeProps> = ({
    children,
}) => {
    const { formattedDuration, formattedTime } = useNedPlayerTime();

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
