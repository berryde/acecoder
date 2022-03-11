const EMAIL = 'panda.mountain.574@example.com';
const PASSWORD = 'securepassword';
const NAME = 'Panda Mountain';

export const login = (email = EMAIL, password = PASSWORD): void => {
	cy.visit(`http://localhost:3000/login`);
	cy.wait(500);
	cy.get('input[placeholder="Email"]').click().type(email);
	cy.get('input[placeholder="Password"]').click().type(password);
	cy.contains('Sign in').click();
};

export const register = (
	email: string,
	name = NAME,
	password = PASSWORD,
	confirm = PASSWORD
): void => {
	cy.visit(`http://localhost:3000/register`);
	cy.wait(500);
	cy.get('input[placeholder="Email"]').click().type(email);
	cy.get('input[placeholder="Full name"]').click().type(name);
	cy.get('input[placeholder="Password"]').click().type(password);
	cy.get('input[placeholder="Confirm password"]').click().type(confirm);
	cy.contains('Sign up').click();
};
