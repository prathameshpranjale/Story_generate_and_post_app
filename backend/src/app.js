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
app.use(express.urlencoded({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
// import userRouter from "./routes/user.routes.js";

// // Route declaration with middleware
// app.use('/api/v1/users', (req, res, next) => {
//     console.log('Route Hit!!!!!', req.path);
//     next();
// }, userRouter);

// Export the app
export { app };