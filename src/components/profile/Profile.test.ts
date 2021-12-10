import 'svelte';
import '@testing-library/jest-dom';
import Profile from './Profile.svelte';
import { goto } from '$app/navigation.js';
import { auth } from 'src/utils/firebase';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import { onAuthStateChanged } from '@firebase/auth';

jest.mock('$app/navigation.js', () => ({
	goto: jest.fn()
}));

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
			expect(goto as jest.Mock).toHaveBeenCalledTimes(1);
		}),
		it("displays the current user's display name", () => {
			const { getByText } = render(Profile);
			expect(getByText('Hi, Test user')).toBeInTheDocument();
		});
});
