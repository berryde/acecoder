export const post = async (url: string, data = {}): Promise<Record<string, unknown>> => {
	// Default options are marked with *
	return await fetch(url, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(data)
	}).then((response) => response.json());
};

export const get = async (url: string): Promise<Record<string, unknown>> => {
	return await fetch(url, {
		method: 'GET'
	}).then((response) => response.json());
};
