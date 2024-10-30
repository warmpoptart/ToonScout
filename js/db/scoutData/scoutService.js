import { connectToScoutDB } from './scoutDB.js';

export async function storeScoutToken(userId, data) {
    const collection = await connectToScoutDB();

    try {
        const result = await collection.updateOne(
            { userId: userId },
            { $set: 
                { data: data, modified: new Date() },
                $setOnInsert: { hidden: true } 
            },
            { upsert: true }
        );
        return result.modifiedCount;
    } catch (error) {
        console.error('Error storing token:', error.message);
        throw error; // Propagate error to caller
    }
}

export async function getScoutToken(userId) {
    const collection = await connectToScoutDB();

    try {
        const user = await collection.findOne({ userId: userId });
        if (user) {
	    const modified = new Date(user.modified);
            return { data: JSON.parse(user.data).data, modified: modified, hidden: user.hidden }
	    }
        return null;
    } catch (error) {
        console.error('Error retrieving token:', error.message);
        throw error;
    }
}

export async function updateHidden(userId) {
    const collection = await connectToScoutDB();
    try {
        const user = await collection.findOne({ userId: userId });
        if (user) {
            const status = user.hidden === undefined ? false : !user.hidden;
            await collection.updateOne(
                { userId: userId },
                { $set: { hidden: status }}
            );
            return status;
        }
        return null; // user not found
    } catch (error) {
        console.error("Error updating hidden:", error.message);
        throw error;
    }
}
