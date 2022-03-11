import { login } from './utils';

describe('Routes', () => {
	it('Private routes redirect to login when not authenticated', () => {
		login();
		cy.get('div[aria-label="open profile menu"]').click();
		cy.contains('Log out').click();
		cy.visit('http://localhost:3000/dashboard');
		cy.location('pathname').should('eq', '/login');
	});
});
