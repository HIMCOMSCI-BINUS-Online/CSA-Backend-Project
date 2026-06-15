require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createTables } = require('./db');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { successResponse } = require('./utils/apiResponse');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/v1/health', (req, res) => successResponse(res, 'API is running', {
  app: 'CSA Minimalist Todo Backend',
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/todos', todoRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Database initialization failed:', error.message);
});
