import express from 'express';
import cors from 'cors';
import { connectDB } from './config/Db.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
app.listen(3001, () => {
    connectDB();
    console.log('Server running on http://localhost:3001');
});
