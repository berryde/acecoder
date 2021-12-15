import { get } from 'svelte/store';
import { addMessage, clearConsole, messages } from './console';

describe('the console library', () => {
	it('can add a message to the console', () => {
		addMessage({
			data: 'Hello there',
			type: 'log'
		});
		expect(get(messages)).toStrictEqual([
			{
				data: 'Hello there',
				type: 'log'
			}
		]);
	});
	it('can clear the messages from the console', () => {
		messages.set([]);
		addMessage({
			data: 'Hello there',
			type: 'log'
		});
		clearConsole();
		expect(get(messages)).toStrictEqual([]);
	});
});
