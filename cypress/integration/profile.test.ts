export {};

describe('Profile', () => {
	it('Profiles are public', () => {
		cy.visit('http://localhost:3000/profile/651r5tWvca6jbYNPGrFIsYlWpxLa');
		cy.contains("Panda Mountain's profile");
		cy.contains('Certificates');
		cy.contains('Personal Portfolio');
		cy.contains('Achievements');
	});
});
