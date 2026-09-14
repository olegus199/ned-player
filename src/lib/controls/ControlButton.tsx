import { FC } from 'react';
import { cssClassNames } from '../utils';
import { ControlButtonProps, IconSize } from '../types';

const ControlButton: FC<ControlButtonProps> = ({
    className,
    icon: IconComponent,
    iconSize = IconSize.SM,
    isActive,
    onClick,
}) => {
    return (
        <button
            className={cssClassNames('ned-player__control-button', {
                ['ned-player__control-button--active']: isActive,
            }, className)}
            onClick={onClick}
        >
            <IconComponent className={`ned-player__icon--${iconSize}`} />
        </button>
    );
};

export default ControlButton;
