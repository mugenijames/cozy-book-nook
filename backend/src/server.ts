import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bookRoutes from './routes/book.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Ghost Request Logger/Filter
app.use((req, res, next) => {
  if (req.method === 'GET' && req.originalUrl.includes('upload-cover')) {
    return res.status(204).end();
  }
  console.log(`>>> Incoming Request: ${req.method} ${req.originalUrl} | Referrer: ${req.get('Referer')}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/books', bookRoutes);
app.use('/api', uploadRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error Handler caught:', err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.timeout = 600000;