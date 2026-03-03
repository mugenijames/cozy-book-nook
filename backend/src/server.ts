import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/book.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Cozy Book Nook Backend is running! 📚' });
});

app.use('/api/books', bookRoutes);
app.use('/api/upload', uploadRoutes);
// For Vercel serverless — export the app
export default app;

// Only listen in local dev (Vercel ignores this)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}