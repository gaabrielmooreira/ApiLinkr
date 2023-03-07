import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import trendsRouter from './routes/trends.routes.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use([authRouter,userRouter,postsRouter,trendsRouter]);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server is running in Port: ${PORT}!!`));