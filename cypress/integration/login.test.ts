import { login } from './utils';

describe('Authentication', () => {
	it('The user is able to log in', () => {
		login();
		cy.contains('Get started creating eye-catching, responsive websites.');
	});
	it('Logging in with an invalid email shows an error', () => {
		login('testtest.com');
		cy.contains('Invalid email');
	});
	it('The user is able to log out', () => {
		login();
		cy.get('div[aria-label="open profile menu"]').click();
		cy.contains('Log out').click();
		cy.contains('Welcome back');
	});
});
