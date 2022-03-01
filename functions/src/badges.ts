import { Transaction, getFirestore } from 'firebase-admin/firestore';
import type { Badge, UserStats } from '~shared/types';

export const calculateBadges = async (
	transaction: Transaction,
	stats: UserStats
): Promise<Record<string, Badge>> => {
	const result: Record<string, Badge> = {};
	const store = getFirestore();

	const badges = Object.fromEntries(
		(await transaction.get(store.collection('badges'))).docs.map((doc) => [
			doc.id,
			doc.data() as Badge
		])
	);

	for (const id in badges) {
		const badge = badges[id];
		if (!!badge.conditions && badge.conditions != {}) {
			for (const key of Object.keys(badge.conditions)) {
				if (key in stats && stats[key] == badge.conditions[key]) result[id] = badge;
			}
		}
	}

	return result;
};
