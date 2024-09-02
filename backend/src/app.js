import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Import routes
import userRouter from "./routes/user.route.js";

// Route declaration with middleware
app.use('/api/v1/users', (req, res, next) => {
    console.log('Route Hit!!!!!', req.path);
    next();
}, userRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// Export the app
// http://localhost:8000/api/v1/users/register

export { app };