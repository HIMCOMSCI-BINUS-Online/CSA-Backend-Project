require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
require('./models/todoModels')

const todoRoutes = require('./routes/todoRoutes');
const successResponse = require('./utils/apiResponse');

const app = express()

app.use(express.json());

app.get('/health', (req, res) => successResponse(res, 'API is running', {
  app: 'CSA Todo Backend',
}));

app.use('/api/v1/todos', todoRoutes)

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

const PORT = process.env.PORT || 3000;

sequelize.sync({
  alter: true
}).then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
  })
}).catch((err) => {
  console.error('Database connection failed:', err.message)
})
