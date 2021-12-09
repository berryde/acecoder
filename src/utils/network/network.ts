import { auth } from '../firebase';

/**
 * Perform an HTTP get request to the provided URL.
 *
 * @param url The URL to request
 * @returns The response body
 */
export const get = async (url: string): Promise<Record<string, unknown>> => {
	return await fetch(url, {
		method: 'GET',
		headers: {
			authorization: `Bearer ${await auth.currentUser.getIdToken()}`
		}
	}).then((response) => response.json());
};
