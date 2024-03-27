import mongoose from "mongoose";

export async function connectMongodb(url) {
    try {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error connecting with database:", error);
        throw error; // Rethrow the error to handle it in the caller
    }
}
    
