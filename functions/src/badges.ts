import { store } from './index';
import type admin = require('firebase-admin');
import type { Badge, UserStats } from './types';

export const calculateBadges = async (
	transaction: admin.firestore.Transaction,
	stats: UserStats
): Promise<Record<string, Badge>> => {
	const result: Record<string, Badge> = {};

	const badges = Object.fromEntries(
		(await transaction.get(store.collection('badges'))).docs.map((doc) => [
			doc.id,
			doc.data() as Badge
		])
	);

	for (let id in badges) {
		const badge = badges[id];
		if (!!badge.conditions && badge.conditions != {}) {
			for (let key of Object.keys(badge.conditions)) {
				if (key in stats && stats[key] == badge.conditions[key]) result[id] = badge;
			}
		}
	}

	return result;
};
