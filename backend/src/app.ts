import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import cors from 'cors'; // Importa o CORS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições
app.use(cors()); // Habilita CORS para permitir requisições do frontend

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Bem-vindo à API de RH!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});