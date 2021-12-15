import '@testing-library/jest-dom';
import Profile from './Profile.svelte';
import { auth } from 'src/utils/firebase';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';

global.window = Object.create(window);
const url = 'http://test.com';
Object.defineProperty(window, 'location', {
	value: {
		href: url
	}
});

jest.mock('src/utils/firebase', () => ({
	auth: {
		signOut: jest.fn()
	}
}));

jest.mock('src/utils/auth/auth', () => ({ getName: jest.fn(() => 'Test user') }));

describe('The profile component', () => {
	it('signs out when clicked', () => {
		const { getByText } = render(Profile);
		const button = getByText('Sign out');
		fireEvent.click(button);
		expect(auth.signOut as jest.Mock).toHaveBeenCalledTimes(1);
	}),
		it('goes to the homepage when clicked', () => {
			const { getByText } = render(Profile);
			const button = getByText('Homepage');
			fireEvent.click(button);
			expect(window.location.href).toBe('/');
		}),
		it("displays the current user's display name", () => {
			const { getByText } = render(Profile);
			expect(getByText('Hi, Test user')).toBeInTheDocument();
		});
});
