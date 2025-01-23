import express from 'express';
import cors from 'cors';
import { connectDB } from './config/Db.js';
import userRouter from './routes/user.route.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.listen(3001, () => {
    connectDB();
    console.log('Server running on http://localhost:3001');
});