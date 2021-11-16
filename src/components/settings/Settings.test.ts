import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Settings from './Settings.svelte';
import { formatOnSave, darkMode } from '../../utils/settings/settings';

describe('The settings component', () => {
	it('Updates format on save', () => {
		render(Settings);
		let fos: boolean;
		formatOnSave.subscribe((value) => {
			fos = value;
		});
		expect(fos).toBeFalsy();
		const toggle = screen.getByTestId('toggle-format');
		fireEvent.click(toggle);
		expect(fos).toBeTruthy();
	});
	it('Updates dark mode', () => {
		render(Settings);
		let dark: boolean;
		darkMode.subscribe((value) => {
			dark = value;
		});
		expect(dark).toBeTruthy();
		const toggle = screen.getByTestId('toggle-dark');
		fireEvent.click(toggle);
		expect(dark).toBeFalsy();
	});
});
