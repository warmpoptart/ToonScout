import { connecToScoutDB } from './scoutDB.js';

export async function storeScoutToken(userId, data) {
    const collection = await connecToScoutDB();

    try {
        const result = await collection.updateOne(
            { userId: userId },
            { $set: { data: data, modified: new Date() } },
            { upsert: true }
        );
        return result.modifiedCount;
    } catch (error) {
        console.error('Error storing token:', error.message);
        throw error; // Propagate error to caller
    }
}

export async function getScoutToken(userId) {
    const collection = await connecToScoutDB();

    try {
        const user = await collection.findOne({ userId: userId });
        if (user) {
	    const modified = new Date(user.modified);
            return { data: JSON.parse(user.data).data, modified: modified }
	}
        return null;
    } catch (error) {
        console.error('Error retrieving token:', error.message);
        throw error;
    }
}
