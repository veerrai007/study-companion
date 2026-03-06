import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export const dbConnect = async () => {

    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '');
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Database connetion failed", error);
        process.exit(1);
    }
}