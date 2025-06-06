-- CreateTable
CREATE TABLE "Usuarios" (
    "username" VARCHAR(30) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "status" CHAR(1) NOT NULL,
    "quant_acesso" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Funcionarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "sobrenome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "data_contratacao" DATE NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "salario" DECIMAL(10,2) NOT NULL,
    "status" CHAR(1) NOT NULL DEFAULT 'A',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionarios_email_key" ON "Funcionarios"("email");
