import { writable } from 'svelte/store';

/**
 * Whether the editor should be formatted on save.
 */
export const formatOnSave = writable(true);
/**
 * Whether the dark mode theme should be used.
 */
export const darkMode = writable(true);
