import { render, screen } from '@testing-library/svelte';
import CircularProgressIndicator from './CircularProgressIndicator.svelte';

describe('The CircularProgressIndicator component', () => {
	it('displays with the dark prop', () => {
		render(CircularProgressIndicator, {
			props: {
				variant: 'dark'
			}
		});
		expect(screen.getByTestId('loader')).toHaveClass('border-brand-background');
	});
	it('displays with the light prop', () => {
		render(CircularProgressIndicator, {
			props: {
				variant: 'light'
			}
		});
		expect(screen.getByTestId('loader')).toHaveClass('border-brand-text');
	});
});
