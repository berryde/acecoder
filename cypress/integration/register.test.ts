import { v4 as uuidv4 } from 'uuid';
import { register } from './utils';

describe('Registration', () => {
	it('Registering with an existing email throws an error', () => {
		register('test@test.com');
		cy.contains('Email already exists');
	});
	it('Registering with an invalid email throws an error', () => {
		register('testtest.com');
		cy.contains('Invalid email');
	});
	// it('The user is able to register', () => {
	// 	register(`test-${uuidv4()}@test.com`);
	// 	cy.contains('Get started creating eye-catching, responsive websites.');
	// });
});
