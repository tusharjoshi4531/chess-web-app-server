import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authenticationRouter from "./routes/authentication";
import challengeRouter from "./routes/challenges";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
    })
);

app.use(express.json());

app.use("/auth", authenticationRouter);
app.use("/challenge", challengeRouter);

const mongoDbApiKey = process.env.MONGODB_API_KEY!;
const tempMongoDbApiKey = process.env.TEMP_MONGO_URL!;

mongoose.set("strictQuery", false);
mongoose
    .connect(mongoDbApiKey)
    .then(() => {
        console.log("connected to mongoose");
    })
    .catch((error) => {
        console.log(error);
    });

export default app;
