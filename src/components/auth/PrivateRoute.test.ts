import '@testing-library/jest-dom';
import 'svelte';
import { render } from '@testing-library/svelte';
import PrivateRoute from './PrivateRoute.svelte';
import { auth } from 'src/utils/firebase';
import type { User } from '@firebase/auth';

jest.mock('src/utils/firebase', () => {
	let user = {};
	let authChanged: (user: User) => void;

	const signOut = () => {
		user = undefined;
		authChanged(undefined);
	};

	return {
		auth: {
			currentUser: user,
			onAuthStateChanged: (fn: () => void) => (authChanged = fn),
			signOut: signOut
		}
	};
});

describe('The PrivateRoute component', () => {
	it('displays the child content when the currentUser is not null', () => {
		const { getByTestId } = render(PrivateRoute);
		expect(() => getByTestId('loader')).toThrow();
	});
	it('displays the progress indicator when the current user is undefined', async () => {
		const { findByTestId } = render(PrivateRoute);
		await auth.signOut();
		expect(await findByTestId('loader')).toBeInTheDocument();
	});
});
