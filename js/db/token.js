import { connectToDatabase } from './db.js';

export async function storeToken(userId, data) {
    const jsonData = JSON.stringify(data);
    const collection = await connectToDatabase();

    try {
        const result = await collection.updateOne(
            { userId: userId },
            { $set: { data: jsonData, modified: new Date() } },
            { upsert: true }
        );
        return result.modifiedCount;
    } catch (error) {
        console.error('Error storing token:', error.message);
        throw error; // Propagate error to caller
    }
}

export async function getToken(userId) {
    const collection = await connectToDatabase();

    try {
        const user = await collection.findOne({ userId: userId });
        if (user) {
            const data = JSON.parse(JSON.parse(user.data));
	        const modified = new Date(user.modified);
            return { data: data.data, modified: modified }
        }
        return null;
    } catch (error) {
        console.error('Error retrieving token:', error.message);
        throw error;
    }
}
