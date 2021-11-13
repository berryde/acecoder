import { writable } from 'svelte/store';
import type { ConsoleMessage } from '../types';

export const messages = writable<ConsoleMessage[]>([]);

export const addMessage = (message: ConsoleMessage) => {
	messages.update((messages) => [...messages, message]);
};

export const clearConsole = () => {
	messages.set([]);
};
