import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Droppable from './Droppable.svelte';

describe('The Droppable component', () => {
	it('Fires a dropped event on drop', async () => {
		const screen = render(Droppable, {
			variant: 'test'
		});
		const dropped = jest.fn();
		const dropzone = screen.getByTestId('dropzone');
		screen.component.$on('dropped', dropped);

		const dataTransfer = {
			getData: jest.fn(() => 'test')
		};
		await fireEvent.drop(dropzone, {
			dataTransfer: dataTransfer
		});
		expect(dropped).toHaveBeenCalledTimes(1);
	});
	it("Fires no dropped event on drop if variant doesn't match", async () => {
		const screen = render(Droppable, {
			variant: 'test'
		});
		const dropped = jest.fn();
		const dropzone = screen.getByTestId('dropzone');
		screen.component.$on('dropped', dropped);

		const dataTransfer = {
			getData: jest.fn(() => 'random-variant')
		};
		await fireEvent.drop(dropzone, {
			dataTransfer: dataTransfer
		});
		expect(dropped).toHaveBeenCalledTimes(0);
	});
});
