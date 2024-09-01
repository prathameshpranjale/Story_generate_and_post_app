import dotenv from "dotenv";
import connectDB from "./db/indexdb.js";  // Updated to point to the correct path
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

// Error handler for the app
app.on("error", (error) => {
    console.log("ERROR", error);
});

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
    });
