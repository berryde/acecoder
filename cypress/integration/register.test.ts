import { register } from './utils';

describe('Registration', () => {
	it('Registering with an existing email throws an error', () => {
		register('panda.mountain.574@example.com');
		cy.contains('Email already exists');
	});
	it('Registering with an invalid email throws an error', () => {
		register('testtest.com');
		cy.contains('Invalid email');
	});
});
