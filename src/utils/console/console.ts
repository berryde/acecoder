import { writable } from 'svelte/store';
import type { ConsoleMessage, WorkerError } from '../types';

export const messages = writable<ConsoleMessage[]>([]);
/**
 * The error output of the most recent compilation, if any
 */
export const latestError = writable<WorkerError>();

export const addMessage = (message: ConsoleMessage) => {
	messages.update((messages) => [...messages, message]);
};

export const clearConsole = () => {
	messages.set([]);
};
