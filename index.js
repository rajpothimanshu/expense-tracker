import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.routes.js"
import expenseRoute from "./routes/expense.routes.js"

dotenv.config({});


const app = express();
const PORT = 8000;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/expense", expenseRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`App is listening at ${PORT}`);
})






