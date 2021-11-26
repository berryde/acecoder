import type { RequestHandler } from '@sveltejs/kit';
import { setClaim } from 'src/utils/admin/admin';

export const post: RequestHandler = async (request) => {
	if (import.meta.env.DEV) {
		const uid = request.body['uid'];
		const claim = request.body['claim'];
		const result = await setClaim(uid, claim);
		return {
			body: {
				success: result
			}
		};
	}
	return {
		body: {
			success: false
		}
	};
};
