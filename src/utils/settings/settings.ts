import { writable } from 'svelte/store';

export const formatOnSave = writable(false);
export const reloadOnSave = writable(true);
