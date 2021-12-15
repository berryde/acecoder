import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Settings from './Settings.svelte';
import {
	toggleFormatOnSave,
	toggleDarkMode,
	darkMode,
	formatOnSave
} from 'src/utils/settings/settings';

jest.mock('src/utils/settings/settings', () => ({
	toggleFormatOnSave: jest.fn(),
	toggleDarkMode: jest.fn()
}));

describe('The settings component', () => {
	it('Toggles format on save', () => {
		render(Settings);
		const toggle = screen.getByTestId('toggle-format');
		fireEvent.click(toggle);
		expect(toggleFormatOnSave as jest.Mock).toBeCalledTimes(1);
	});
	it('Toggles dark mode', () => {
		render(Settings);
		const toggle = screen.getByTestId('toggle-dark');
		fireEvent.click(toggle);
		expect(toggleDarkMode as jest.Mock).toBeCalledTimes(1);
	});
});
