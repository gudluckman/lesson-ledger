import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect';
import userRouter from './routes/user.routes';
import studentRouter from './routes/student.routes';
import calendarRouter from './routes/calendar.routes';
import earningRouter from './routes/earning.route';
import yearlyEarningRouter from './routes/yearly_earning.route';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello World!' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/lessons', calendarRouter);
app.use('/api/v1/earnings', earningRouter);
app.use('/api/v1/yearly-earnings', yearlyEarningRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL as string);

    app.listen(process.env.PORT as string, () => console.log(`Server started on port ${process.env.PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
