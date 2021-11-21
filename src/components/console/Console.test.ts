import '@testing-library/jest-dom';
import Console from './Console.svelte';
import { render } from '@testing-library/svelte';
import type { PreviewMessage } from '../../utils/types';

describe('The console component', () => {
	it('displays the provided messages', () => {
		const messages: PreviewMessage[] = [
			{
				data: 'Something went wrong',
				type: 'error'
			},
			{
				data: 'This is some info',
				type: 'log'
			},
			{
				data: 'Heed my warning',
				type: 'warn'
			}
		];
		const { getByText } = render(Console, {
			props: {
				messages: messages
			}
		});
		expect(getByText('This is some info')).toBeInTheDocument();
		expect(getByText('Something went wrong')).toBeInTheDocument();
		expect(getByText('Heed my warning')).toBeInTheDocument();
	});
	it('groups repeated messages', () => {
		const messages: PreviewMessage[] = [
			{
				data: 'This is some info',
				type: 'log'
			},
			{
				data: 'This is some info',
				type: 'log'
			},
			{
				data: 'This is some info',
				type: 'log'
			}
		];
		const { getByText } = render(Console, {
			props: {
				messages: messages
			}
		});
		expect(getByText('This is some info')).toBeInTheDocument();
		expect(getByText('3')).toBeInTheDocument();
	});
	it("doesn't group messages with same data but different type are being grouped in the console", () => {
		const messages: PreviewMessage[] = [
			{
				data: 'This is some info',
				type: 'log'
			},
			{
				data: 'This is some info',
				type: 'error'
			},
			{
				data: 'This is some info',
				type: 'error'
			}
		];
		const { getAllByText, getByText } = render(Console, {
			props: {
				messages: messages
			}
		});
		expect(getAllByText('This is some info')).toBeTruthy();
		expect(getByText('2')).toBeInTheDocument();
	});
});
