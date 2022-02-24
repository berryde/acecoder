describe('Authentication', () => {
	it('The user is able to log in', () => {
		cy.visit('https://acecoder.vercel.app/');
		cy.contains('Sign in').click();
		cy.get('input[placeholder="Email"]').type('testuser@test.com');
		cy.get('input[placeholder="Password"]').type('testpassword');
		cy.contains('Sign in').click();
	});
});
