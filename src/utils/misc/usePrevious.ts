import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T) {
    const valueRef = useRef<T | null>(null);
    useEffect(() => {
        valueRef.current = value;
    }, [value]);
    return valueRef.current;
}
