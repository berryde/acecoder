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
	it('The user can edit the preview', () => {
		// Add commands with studio
		cy.visit('http://localhost:3000/project/yPtFSfYJwzTzsjJhch6b/exercise-0');
		const container = cy.get('.ace_editor');
		if (!container) throw new Error('The editor could not be found');

		const editor = ace.edit(container);
		editor.session.setValue('Hello World');
	});
});
