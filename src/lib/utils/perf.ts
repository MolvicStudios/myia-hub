/** Debounce a function call */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
	let timer: ReturnType<typeof setTimeout>;
	return ((...args: unknown[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	}) as T;
}

/** Throttle a function to execute at most once per interval */
export function throttle<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
	let last = 0;
	let timer: ReturnType<typeof setTimeout> | null = null;
	return ((...args: unknown[]) => {
		const now = Date.now();
		const remaining = ms - (now - last);
		if (remaining <= 0) {
			if (timer) { clearTimeout(timer); timer = null; }
			last = now;
			fn(...args);
		} else if (!timer) {
			timer = setTimeout(() => {
				last = Date.now();
				timer = null;
				fn(...args);
			}, remaining);
		}
	}) as T;
}
