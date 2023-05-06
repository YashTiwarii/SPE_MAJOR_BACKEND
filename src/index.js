import express from "express";
import cors from 'cors'

import mongoose from "mongoose"

import {userRouter } from './routes/users.js';
import {workoutsRouter } from './routes/workouts.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth",userRouter);
app.use("/workouts",workoutsRouter);

mongoose.connect("mongodb+srv://yash2411:yash2411@cluster0.sb3jj38.mongodb.net/?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(3001, () => console.log("Server started"));
