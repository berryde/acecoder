import 'svelte';
import '@testing-library/jest-dom';
import Exercise from './Exercise.svelte';
import { render } from '@testing-library/svelte';
import { exercise } from 'src/utils/exercise/exercise';

describe('The Exercise component', () => {
	it('displays a loader if the exercise is undefined', () => {
		const { getByTestId } = render(Exercise);
		expect(getByTestId('loader')).toBeInTheDocument();
	});
	it('displays the details of the current exercise', () => {
		exercise.set({
			description: 'This is a test exercise',
			name: 'Test exercise',
			requirements: ['The test runs'],
			template: undefined,
			tests: {}
		});
		const { getByText } = render(Exercise);
		expect(getByText('This is a test exercise')).toBeInTheDocument();
		expect(getByText('The test runs')).toBeInTheDocument();
	});
});
