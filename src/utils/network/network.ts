import { auth } from '../firebase';

/**
 * Perform an HTTP GET request to the provided URL.
 *
 * @param url The URL to request
 * @returns The response body
 */
export const get = async (url: string): Promise<Record<string, unknown>> => {
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				authorization: `Bearer ${await auth.currentUser.getIdToken()}`
			}
		});
		return response.json();
	} catch (err) {
		throw 'Request failed';
	}
};
