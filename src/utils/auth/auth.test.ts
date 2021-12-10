import { getName } from './auth';

jest.mock('src/utils/firebase', () => ({
	auth: {
		onAuthStateChanged: jest.fn(),
		currentUser: {
			displayName: 'Test User'
		}
	}
}));

describe('The auth library', () => {
	it('gets the first name of the current user', () => {
		expect(getName()).toBe('Test');
	});
});
