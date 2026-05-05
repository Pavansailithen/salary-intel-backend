import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import salaryRoutes from './routes/salary.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', salaryRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
