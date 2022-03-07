import { login } from './utils';

describe('Certificate', () => {
	it('Certificates are public', () => {
		cy.visit(`http://localhost:3000/certificate/EEsng24xxLxH70yR4uIe`);
		cy.contains('Orange Algae');
		cy.contains('Personal Portfolio');
		cy.get('Add to profile').should('not.exist');
	});
	it('Only the user can add their certificate to LinkedIn', () => {
		login();
		cy.visit(`http://localhost:3000/certificate/EEsng24xxLxH70yR4uIe`);
		cy.contains('Orange Algae');
		cy.contains('Personal Portfolio');
		cy.get('Add to profile').should('exist');
	});
});
