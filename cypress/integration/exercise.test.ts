import { login } from './utils';

describe('Exercises', () => {
	it('The user can load an exercise', () => {
		login();
		cy.visit(`http://localhost:3000/dashboard`);

		// Select the personal portfolio project
		cy.get('img[aria-label="Personal Portfolio project"]').click();
		cy.contains('Introduction to portfolio sites').click();

		// Check that the preview is rendering the project
		cy.contains('Notes');
		cy.contains('Files');
	});
});
