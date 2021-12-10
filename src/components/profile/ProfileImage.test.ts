import 'svelte';
import '@testing-library/jest-dom';
import ProfileImage from './ProfileImage';
import { render } from '@testing-library/svelte';

jest.mock('src/utils/firebase', () => ({
	auth: {
		currentUser: {
			photoURL: 'https://via.placeholder.com/150'
		}
	}
}));

describe('The ProfileImage component', () => {
	it('provides an image with the specified URL', () => {
		const { container } = render(ProfileImage);
		expect(container.querySelector('[src="https://via.placeholder.com/150"]'));
	});
});
