import '@testing-library/jest-dom';
import 'svelte';
import { render } from '@testing-library/svelte';
import PrivateRoute from './PrivateRoute.svelte';
import { auth } from 'src/utils/firebase';
import type { User } from 'firebase/auth';

jest.mock('src/utils/firebase', () => {
	let user: User | undefined = {
		displayName: 'Test User',
		emailVerified: false,
		email: 'test@test.com',
		isAnonymous: false,
		metadata: {},
		providerData: [],
		refreshToken: '',
		delete: jest.fn(),
		getIdToken: jest.fn(),
		getIdTokenResult: jest.fn(),
		phoneNumber: '2112414',
		photoURL: '',
		providerId: 'provider_id',
		reload: jest.fn(),
		tenantId: '',
		toJSON: jest.fn(),
		uid: 'asdnp125Uuhas'
	};
	let authChanged: (user: User | undefined) => void;
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

const assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock as unknown } as Location;

afterEach(() => {
	assignMock.mockClear();
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
