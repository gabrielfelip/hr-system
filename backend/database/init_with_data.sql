-- Este arquivo é principalmente para referência ou para criar o DB e tabelas manualmente.
-- Para o fluxo com Prisma, as tabelas serão criadas via `prisma migrate dev`.
-- No entanto, você pode usá-lo para criar o banco de dados e usuários de DB.

-- Exemplo: Criar um banco de dados
-- CREATE DATABASE rh_db;

-- A tabela Usuarios será criada pelo Prisma.
-- INSERT INTO Usuarios (Username, Password, Nome, Tipo, Status, Quant_Acesso)
-- VALUES ('admin', '$2a$10$B50Q8PjY9F1b2tP0R7W19.gL1x2y3z4a5b6c7d8e9f0', 'Administrador Padrão', '0', 'A', 0);
-- A senha '$2a$10$B50Q8PjY9F1b2tP0R7W19.gL1x2y3z4a5b6c7d8e9f0' é o hash de 'password123'. Altere-a!

-- Para um seed de dados, use o script `backend/prisma/seed.ts`