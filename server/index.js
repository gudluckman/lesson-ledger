import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import studentRouter from './routes/student.routes.js';
import calendarRouter from './routes/calendar.routes.js';
import earningRouter from './routes/earning.route.js';
import yearlyEarningRouter from './routes/yearly_earning.route.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
})

app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/lessons', calendarRouter);
app.use('/api/v1/earnings', earningRouter);
app.use('/api/v1/yearly-earnings', yearlyEarningRouter);

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
  } catch (error) {
    console.log(error);
  }
}

startServer();