import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 TaskMind Backend Server running!`);
    console.log(`📡 URL:          http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🗄️  DB check:     http://localhost:${PORT}/api/v1/health/db`);
    console.log(`====================================================`);
});