import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
    connectDB();
    console.log('Server running on port 3001');
});