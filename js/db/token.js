import { connectToDatabase } from './db.js';

export async function storeToken(userId, data) {
    const jsonData = JSON.stringify(data);
    const collection = await connectToDatabase();

    try {
        const result = await collection.updateOne(
            { userId: userId },
            { $set: { data: jsonData } },
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
        return user ? JSON.parse(JSON.parse(user.data)).data : null;
    } catch (error) {
        console.error('Error retrieving token:', error.message);
        throw error;
    }
}
