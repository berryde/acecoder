import { writable } from 'svelte/store';
import type { PreviewMessage, WorkerError } from '../types';

export const messages = writable<PreviewMessage[]>([]);
/**
 * The error output of the most recent compilation, if any
 */
export const latestError = writable<WorkerError>();

export const addMessage = (message: PreviewMessage): void => {
	messages.update((messages) => [...messages, message]);
};

export const clearConsole = (): void => {
	messages.set([]);
};
