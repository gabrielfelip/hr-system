# Sistema de Gerenciamento de RH

Este projeto é uma aplicação web completa para gerenciamento de Recursos Humanos (RH), desenvolvida em TypeScript, utilizando Node.js com Express no backend e React no frontend. Ele inclui funcionalidades de autenticação de usuários, manutenção de senhas e operações CRUD (Create, Read, Update, Delete) para a entidade "Funcionários", com persistência de dados em PostgreSQL, **utilizando Prisma como ORM**.

## Tecnologias Utilizadas

* **Backend:**
    * TypeScript
    * Node.js
    * Express.js
    * PostgreSQL (Banco de Dados)
    * **Prisma (ORM)**
    * `bcryptjs` (Criptografia de senhas)
    * `jsonwebtoken` (JSON Web Tokens para autenticação)
    * `dotenv` (Variáveis de ambiente)
    * `cors` (Habilitar Cross-Origin Resource Sharing)
* **Frontend:**
    * TypeScript
    * React.js
    * Vite (Ferramenta de build)
    * `axios` (Cliente HTTP)
    * `react-router-dom` (Rotas no frontend)

## Funcionalidades Implementadas

* **Autenticação de Usuário:**
    * Cadastro de novos usuários com login e senha criptografada.
    * Login com verificação de credenciais.
    * Criação de tokens de sessão (JWT) para controle de acesso a rotas protegidas.
    * Logout (invalidação de sessão via remoção do token do cliente).
* **Manutenção de Senhas:**
    * Alteração de senha por usuário autenticado.
    * Recuperação de senha via e-mail (fluxo simulado, sem envio real).
* **Operações CRUD de Funcionários:**
    * **Criar (Create):** Adicionar novos funcionários.
    * **Listar (Read):** Visualizar a lista de todos os funcionários com paginação.
    * **Editar (Update):** Modificar informações de funcionários existentes.
    * **Excluir (Delete):** Remover registros de funcionários.
* **Controle de Acesso Baseado em Papéis (RBAC):**
    * Administradores (`Tipo: 0`) têm permissão para adicionar, editar e excluir funcionários.
    * Usuários Comuns (`Tipo: 1`) podem apenas listar e visualizar detalhes de funcionários.
* **Persistência de Dados:**
    * Todos os dados são armazenados em um banco de dados PostgreSQL.
    * Tabelas configuradas com chaves primárias e relacionamentos (definidos no `schema.prisma`).
    * Utilização de **Prisma ORM** para interação com o banco de dados.



## Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar a aplicação em sua máquina local.

### Pré-requisitos

* Node.js (versão 14 ou superior)
* npm (gerenciador de pacotes do Node.js)
* PostgreSQL (servidor de banco de dados)

### 1. Configuração do Banco de Dados PostgreSQL e Prisma

1.  **Instale o PostgreSQL:** Se você ainda não tem, instale o PostgreSQL em seu sistema.
2.  **Crie um Banco de Dados:** Abra o cliente do PostgreSQL (psql, pgAdmin, etc.) e crie um novo banco de dados para a aplicação. Por exemplo:
    ```sql
    CREATE DATABASE rh_db;
    ```
3.  **Configuração do Backend para Prisma:**
    * Navegue até o diretório do backend:
        ```bash
        cd backend
        ```
    * Instale as dependências, incluindo o Prisma:
        ```bash
        npm install
        ```
    * Crie o arquivo de variáveis de ambiente:
        Copie o arquivo `.env.example` para `.env` na raiz do diretório `backend` e configure a variável `DATABASE_URL` para o seu banco de dados PostgreSQL.
        ```bash
        cp .env.example .env
        ```
        Edite o arquivo `.env`:
        ```env
        PORT=3000
        DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/rh_db"
        JWT_SECRET="uma_chave_secreta_muito_forte_para_jwt_nao_esqueça_de_mudar"
        EMAIL_SERVICE_USER="seu_email@example.com"
        EMAIL_SERVICE_PASS="sua_senha_email"
        ```
        *(Ajuste `seu_usuario`, `sua_senha` e `rh_db` conforme sua configuração do PostgreSQL. Para `JWT_SECRET`, gere uma string aleatória forte.)*
    * **Gere o Prisma Client e execute as migrações:**
        Com o `DATABASE_URL` configurado no `.env`, execute os comandos do Prisma para gerar o cliente e aplicar as migrações que criarão as tabelas no seu banco de dados com base no `schema.prisma`.
        ```bash
        npx prisma migrate dev --name initial_migration
        ```
        Este comando:
        * Cria um novo arquivo de migração no diretório `prisma/migrations`.
        * Aplica as alterações no seu banco de dados (cria as tabelas `Usuarios` e `Funcionarios`).
        * Gera o `Prisma Client` para TypeScript.

### 2. Execução do Backend

1.  **Inicie o servidor backend:**
    Certifique-se de que você ainda está no diretório `backend`.
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000`.

### 3. Configuração e Execução do Frontend

1.  **Abra uma nova janela do terminal e navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie a aplicação frontend:**
    ```bash
    npm run dev
    ```
    A aplicação React será iniciada e geralmente abrirá automaticamente no seu navegador em `http://localhost:5173` (ou outra porta disponível).

### 4. Testando a Aplicação

* Abra seu navegador e acesse a URL do frontend (ex: `http://localhost:5173`).
* Você será direcionado para a página de Login.
* **Para testar o acesso de Administrador:** Você pode registrar um novo usuário com `Tipo: Administrador (0)` na página de cadastro (`/register`).
* Após o login, navegue para o Dashboard e explore as funcionalidades de CRUD de Funcionários. Lembre-se que as operações de criação, edição e exclusão de funcionários são restritas a usuários do tipo `Administrador`.

## Considerações Finais

Este projeto fornece uma base sólida para a atividade utilizando Prisma. Para um ambiente de produção, considere:

* **Validação de Dados:** Adicionar validação de entrada de dados mais robusta no backend (ex: Joi, Zod).
* **Tratamento de Erros:** Implementar um tratamento de erros mais abrangente e amigável, com middleware de erros centralizado.
* **Segurança:** Aprimorar a segurança, como validação de tokens mais rigorosa, CSRF protection, etc.
* **Testes:** Escrever testes unitários e de integração para garantir a estabilidade do código.
* **Docker:** Conteinerizar a aplicação (backend, frontend, PostgreSQL) para facilitar a implantação e o desenvolvimento.
* **Seed de Dados:** Implementar um script de `seed` do Prisma para popular o banco de dados com dados iniciais de forma programática (ex: `prisma/seed.ts` e `npm run prisma:seed`). Isso é mais robusto do que usar um arquivo `.sql` para dados iniciais após a primeira migração.

---

Espero que esta reprodução completa atenda perfeitamente à sua necessidade! Qualquer dúvida, é só me dizer.
