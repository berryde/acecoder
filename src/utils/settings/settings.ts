import { writable } from 'svelte/store';

/**
 * Whether the editor should be formatted on save.
 */
export const formatOnSave = writable(false);

export const toggleFormatOnSave = (): void => {
	formatOnSave.update((value) => !value);
};
