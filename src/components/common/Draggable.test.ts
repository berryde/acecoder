/* eslint-disable sonarjs/no-duplicate-string */
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Draggable from './Draggable.svelte';

describe('The Draggable component', () => {
	it('renders a child with the draggable attribute', () => {
		const { container } = render(Draggable, {
			props: { data: 'index.tsx', variant: 'test' }
		});
		expect(container.querySelector('[draggable]')).toBeInTheDocument();
	});
	it('is draggable', async () => {
		const { container } = render(Draggable, {
			props: { data: 'index.tsx', variant: 'test' }
		});
		const dataTransfer = {
			setData: jest.fn()
		};
		// Fire the drag event.
		const drag = container.querySelector('[draggable]');
		if (!drag) throw new Error('Could not find a draggable object');
		expect(await fireEvent.dragStart(drag, { dataTransfer: dataTransfer })).toBeTruthy();
	});
	it('creates a drag event with the provided values', async () => {
		const { container } = render(Draggable, {
			props: { data: 'index.tsx', variant: 'test' }
		});

		// Create a mock DataTransfer object for the drag event.
		const setData = jest.fn();
		const dataTransfer = {
			setData: setData
		};

		// Fire the drag event.
		const drag = container.querySelector('[draggable]');
		if (!drag) throw new Error('Could not find a draggable object');
		await fireEvent.dragStart(drag, { dataTransfer: dataTransfer });

		expect(setData).toBeCalledWith('text', 'index.tsx');
		expect(setData).toBeCalledWith('variant', 'test');
		expect(setData).toBeCalledTimes(2);
	});
});
