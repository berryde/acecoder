import { writable } from 'svelte/store';
import type { PreviewMessage, WorkerError } from '../types';

/**
 * The messages to display in the console.
 */
export const messages = writable<PreviewMessage[]>([]);

/**
 * The error output of the most recent compilation, if any
 */
export const latestError = writable<WorkerError>();

/**
 * Adds a message to the console.
 */
export const addMessage = (message: PreviewMessage): void => {
	messages.update((messages) => [...messages, message]);
};

/**
 * Clears the console.
 */
export const clearConsole = (): void => {
	messages.set([]);
};
