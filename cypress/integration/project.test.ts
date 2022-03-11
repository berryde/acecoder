import { login } from './utils';

describe('Projects', () => {
	it('The user can select a project', () => {
		login();
		cy.visit(`http://localhost:3000/dashboard`);

		// Select the personal portfolio project
		cy.get('img[aria-label="Personal Portfolio project"]').click();
		cy.contains('Project outline');
		cy.contains("It's all about you");
		cy.contains('Certificate of Completion');
		cy.contains('Your project');
	});
	it('The user can visit the project completion page for a finished project', () => {
		cy.visit('http://localhost:3000/project/n94gjSZZnypQ4Ptu2W1p/finish');
		cy.contains('Certificate of Completion');
		cy.contains('Your project');
	});
	it('The project completion page for an unfinished project shows an error', () => {
		cy.visit('http://localhost:3000/project/aa1pjCwzCA32f7bUeRzq/finish');
		cy.contains(403);
	});
	it('The project completion page for an unknown project shows an error', () => {
		cy.visit('http://localhost:3000/project/fakeproject/finish');
		cy.contains(404);
	});
});
