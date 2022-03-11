import { login } from './utils';

describe('Exercises', () => {
	it('The user can load an exercise', () => {
		login();
		cy.visit(`http://localhost:3000/project/n94gjSZZnypQ4Ptu2W1p/exercise-1`);
		cy.get('button[aria-label="Close modal Tutorial"').click();
		cy.contains('Tasks');
		cy.contains('Files');
	});
	it('The user can submit', () => {
		cy.visit(`http://localhost:3000/project/n94gjSZZnypQ4Ptu2W1p/exercise-1`);
		cy.get('button[aria-label="Close modal Tutorial"').click();
		cy.contains('Re-submit').click();
		cy.contains('Exercise completed!', {
			timeout: 20000
		});
	});
});
