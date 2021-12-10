import 'svelte';
import '@testing-library/jest-dom';
import Feedback from './Feedback.svelte';
import { render } from '@testing-library/svelte';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { fireEvent } from '@testing-library/dom';

jest.mock('firebase/firestore', () => ({
	getFirestore: jest.fn(),
	collection: jest.fn(),
	addDoc: jest.fn(),
	Timestamp: {
		now: jest.fn()
	}
}));

jest.mock('src/utils/firebase', () => ({ db: jest.fn() }));

describe('The feedback component', () => {
	it("doesn't perform a write if there is no valid feedback", () => {
		const { getByText } = render(Feedback);
		const button = getByText('Submit');
		fireEvent.click(button);
		expect(addDoc as jest.Mock).toBeCalledTimes(0);
	});
	it('writes to the feedback collection in firebase', async () => {
		const { getByText, getByTestId } = render(Feedback);

		const feedback = getByTestId('feedback-comment') as HTMLTextAreaElement;
		const select = getByTestId('select-component');

		fireEvent.input(feedback, { target: { value: 'This is an awesome comment' } });
		fireEvent.change(select, { target: { value: 'Settings' } });

		const button = getByText('Submit');
		fireEvent.click(button);

		expect(addDoc as jest.Mock).toBeCalledTimes(1);
	});
});
