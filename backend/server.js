import express from 'express';
import dotenv from 'dotenv';
import sequelize from './model/index.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import cors from 'cors';
import fs from 'fs'
dotenv.config();

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/posts',postRoutes);
app.use('/api/v1/comments',commentRoutes)
  
const PORT = process.env.PORT;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected and models synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

