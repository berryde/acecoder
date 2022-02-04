
import { store } from './index';
import type admin = require('firebase-admin')
import type { Badge, UserStats } from './types';

const getBadge = async (
    transaction: admin.firestore.Transaction,
    badgeID: string
): Promise<Badge> => {
    const snapshot = await transaction.get(store.collection('badges').doc(badgeID));
    if (!snapshot.exists) {
        throw `Badge ${badgeID} does not exist!`;
    }
    return snapshot.data() as Badge;
};

const badges: Record<string, { type: 'project' } | { type: 'stat'; stat: string; value: number }> =
{
    completed_1: {
        type: 'stat',
        stat: 'completed',
        value: 1
    },
    react_1: {
        type: 'stat',
        stat: 'react',
        value: 1
    },
    svelte_1: {
        type: 'stat',
        stat: 'svelte',
        value: 1
    }
};

// TODO:
// get all badges from database instead of using local document

export const calculateBadges = async (
    transaction: admin.firestore.Transaction,
    stats: UserStats,
    projectID: string,
    language: string
): Promise<Record<string, Badge>> => {
    const result: Record<string, Badge> = {};
    const addBadge = async (id: string) => {
        result[id] = await getBadge(transaction, id);
    };

    for (let id in badges) {
        const badge = badges[id]
        if ((badge.type == "stat" && stats[badge.stat] == badge.value) || id == projectID) {
            await addBadge(id);
        }
    }

    return result;
};
