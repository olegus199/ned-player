import { RefObject, useLayoutEffect, useRef } from 'react';

/**
 * Keeps a ref pointing at the latest value from the last render.
 * Lets long-lived listeners (subscribed once) call fresh callbacks
 * without re-subscribing and without stale closures.
 */
const useLatest = <T,>(value: T): RefObject<T> => {
    const ref = useRef(value);

    useLayoutEffect(() => {
        ref.current = value;
    });

    return ref;
};

export default useLatest;
