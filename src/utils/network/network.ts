import { auth } from '../firebase';

/**
 * Perform an HTTP post request to the provided url.
 *
 * @param url The URL to request
 * @param data The data to send
 * @returns The response body
 */
export const post = async (url: string, data = {}): Promise<Record<string, unknown>> => {
	// Default options are marked with *
	return await fetch(url, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	}).then((response) => response.json());
};

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
