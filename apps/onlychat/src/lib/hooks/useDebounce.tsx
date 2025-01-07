import { useEffect, useState } from 'react';

export const useDebounce = <T,>({
	value,
	delay,
}: {
	value: T;
	delay: number;
}): T => {
	const [deboucnedValue, setDebouncedValue] = useState<T>(value);
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearInterval(timer);
		};
	}, [value,delay]);

	return deboucnedValue;
};
