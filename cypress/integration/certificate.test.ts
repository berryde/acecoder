import { login } from './utils';

const URL = 'http://localhost:3000/certificate/3FgVlin07xmQmevMn09C';

describe('Certificate', () => {
	it('Certificates are public', () => {
		cy.visit(URL);
		cy.contains('Panda Mountain');
		cy.contains('Personal Portfolio');
		cy.get('Add to profile').should('not.exist');
	});
	it('Only the user can add their certificate to LinkedIn', () => {
		login();
		cy.wait(500);
		cy.visit(URL);
		cy.contains('Panda Mountain');
		cy.contains('Personal Portfolio');
		cy.contains('Add to profile');
	});
});
