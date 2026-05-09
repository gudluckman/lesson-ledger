import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect';
import userRouter from './routes/user.routes';
import studentRouter from './routes/student.routes';
import calendarRouter from './routes/calendar.routes';
import earningRouter from './routes/earning.route';
import yearlyEarningRouter from './routes/yearly_earning.route';
import authRouter from './routes/auth.routes';
import { requireAuth } from './middleware/auth';

dotenv.config();

const PORT = process.env.PORT || 5005;
let databaseReady = false;

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', requireAuth, userRouter);
app.use('/api/v1/students', requireAuth, studentRouter);
app.use('/api/v1/lessons', requireAuth, calendarRouter);
app.use('/api/v1/earnings', requireAuth, earningRouter);
app.use('/api/v1/yearly-earnings', requireAuth, yearlyEarningRouter);

const initializeDatabase = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB_URL is required');
  }

  if (!databaseReady) {
    await connectDB(process.env.MONGODB_URL);
    databaseReady = true;
  }
};

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (process.env.VERCEL !== '1') {
  startServer();
}

const handler = async (req: Request, res: Response) => {
  await initializeDatabase();
  return app(req, res);
};

export default handler;
