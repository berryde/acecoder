const EMAIL = 'test@test.com';
const PASSWORD = 'securepassword';
const NAME = 'John Smith';

export const login = (email = EMAIL, password = PASSWORD): void => {
	cy.visit(`http://localhost:3000/login`);
	cy.get('input[placeholder="Email"]').type(email);
	cy.get('input[placeholder="Password"]').type(password);
	cy.contains('Sign in').click();
	cy.contains('Get started creating eye-catching, responsive websites.');
};

export const register = (
	email: string,
	name = NAME,
	password = PASSWORD,
	confirm = PASSWORD
): void => {
	cy.visit(`http://localhost:3000/register`);
	cy.get('input[placeholder="Email"]').type(email);
	cy.get('input[placeholder="Full name"]').type(name);
	cy.get('input[placeholder="Password"]').type(password);
	cy.get('input[placeholder="Confirm password"]').type(confirm);
	cy.contains('Sign up').click();
	cy.contains('Get started creating eye-catching, responsive websites.');
};
