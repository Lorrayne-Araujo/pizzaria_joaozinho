🍕 PIZZARIA JOAONZINHO

Sistema simples para gerenciamento de pedidos de uma pizzaria, com opções de massa, borda, sabores e acompanhamento do status do pedido.

Funcionalidades
✅ Listar sabores disponíveis
✅ Escolher massa e borda
✅ Criar pizza com sabores
✅ Criar pedidos
✅ Atualizar status do pedido
✅ Banco de dados relacional (SQL Server)

🧰 Tecnologias usadas
Front-end: HTML, CSS, JavaScript
Back-end: Node.js, Express
Banco de dados: SQL Server
Bibliotecas: mssql, cors

📌 Pré-requisitos
Antes de iniciar, você vai precisar ter instalado:
✅ Node.js
✅ SQL Server (local ou remoto)
✅ SQL Server Management Studio (SSMS) (recomendado)

📥 Como baixar o projeto
``` 
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```
Entre na pasta do projeto:
```
cd SEU-REPOSITORIO
```
Instale as dependências:
``` 
npm install
```

⚙️ Configurando o banco de dados
✅ 1. Crie o banco

Abra o SQL Server Management Studio (SSMS) e execute:
```
CREATE DATABASE pizzaria_joaonzinho
GO
USE pizzaria_joaonzinho;
GO

✅ 2. Crie as tabelas (script completo)
📌 Importante: este script está na ordem correta para evitar erro de FOREIGN KEY.

USE pizzaria_joaonzinho;
GO

-- Tabela bordas
CREATE TABLE bordas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(100)
);
GO

-- Tabela massas
CREATE TABLE massas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(100)
);
GO

-- Tabela sabores
CREATE TABLE sabores (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(100)
);
GO

-- Tabela status
CREATE TABLE status (
    id INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(100)
);
GO

-- Tabela pizzas
CREATE TABLE pizzas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    bordas_id INT NULL,
    massas_id INT NULL,
    
    FOREIGN KEY (bordas_id) REFERENCES bordas(id),
    FOREIGN KEY (massas_id) REFERENCES massas(id)
);
GO

-- Tabela pizza_sabor (relação N:N)
CREATE TABLE pizza_sabor (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pizzas_id INT NULL,
    sabores_id INT NULL,

    FOREIGN KEY (pizzas_id) REFERENCES pizzas(id),
    FOREIGN KEY (sabores_id) REFERENCES sabores(id)
);
GO

-- Tabela pedidos
CREATE TABLE pedidos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pizzas_id INT NULL,
    status_id INT NULL,

    FOREIGN KEY (pizzas_id) REFERENCES pizzas(id),
    FOREIGN KEY (status_id) REFERENCES status(id)
);
GO

-- Inserts iniciais
INSERT INTO status (tipo) VALUES ('Em produção');
INSERT INTO status (tipo) VALUES ('Em entrega');
INSERT INTO status (tipo) VALUES ('Concluído');

INSERT INTO massas (tipo) VALUES ('Massa comum');
INSERT INTO massas (tipo) VALUES ('Massa integral');
INSERT INTO massas (tipo) VALUES ('Massa temperada');

INSERT INTO bordas (tipo) VALUES ('Cheddar');
INSERT INTO bordas (tipo) VALUES ('Catupiry');

INSERT INTO sabores (tipo) VALUES ('4 Queijos');
INSERT INTO sabores (tipo) VALUES ('Frango com Catupiry');
INSERT INTO sabores (tipo) VALUES ('Calabresa');
INSERT INTO sabores (tipo) VALUES ('Lombinho');
INSERT INTO sabores (tipo) VALUES ('Filé com Cheddar');
INSERT INTO sabores (tipo) VALUES ('Portuguesa');
INSERT INTO sabores (tipo) VALUES ('Margherita');
GO
```
🔐 Configuração do arquivo .env (recomendado)
📌 Para não subir sua senha pro GitHub, o ideal é usar variáveis de ambiente.
Crie um arquivo chamado:
✅ .env
Exemplo:
DB_USER=sa
DB_PASSWORD=SuaSenhaAqui
DB_SERVER=localhost
DB_DATABASE=pizzaria_joaonzinho

⚠️ O arquivo `.env` não é versionado por conter informações sensíveis.
Utilize o arquivo `.env.example` como base para criar o seu.

✅ E no seu .gitignore coloque:
.env
node_modules/

▶️ Como rodar o projeto
Inicie o servidor:
node index.js
Ou se tiver script no package.json:
npm start

O projeto vai rodar em algo como:
📍 http://localhost:3000

🧪 Testando
Você pode testar pelo navegador, pelo front-end ou usando:
Postman
Insomnia

📁 Estrutura do projeto (exemplo)
📦 pizzaria_joaonzinho
 ┣ 📂 css
 ┃ ┗ 📄 style.css
 ┣ 📂 html
 ┃ ┣ 📄 index.html
 ┃ ┗ 📄 dashboard.html
 ┣ 📂 img
 ┣ 📂 node_modules
 ┣ 📂 process
 ┃ ┣ 📄 order.js
 ┃ ┣ 📄 orders.js
 ┃ ┣ 📄 pizza.js
 ┃ ┗ 📄 server.js
 ┣ 📂 scripts
 ┣ 📂 templates
 ┃ ┣ 📄 header.html
 ┃ ┗ 📄 footer.html
 ┣ 📄 .env
 ┣ 📄 .env.example
 ┣ 📄 .gitignore
 ┣ 📄 package-lock.json
 ┣ 📄 package.json
 ┗ 📄 README.md

 🌐 Rotas da API (se tiver)
Exemplo:
GET /sabores → lista sabores
GET /massas → lista massas
GET /bordas → lista bordas
POST /pedido → cria um pedido
PUT /pedido/:id/status → atualiza o status

🤝 Contribuindo
Quer contribuir com melhorias, testes ou correções de bugs?
Faça um fork
Crie uma branch:
git checkout -b minha-melhoria
Commit suas mudanças:
git commit -m "Melhoria: ..."
Envie para o GitHub:
git push origin minha-melhoria
Abra um Pull Request ✅

📝 Licença
Este projeto é de uso livre para estudos e melhorias.

👩‍💻 Autor
Feito por Lorrayne Araujo com base no curso (SQL do basico ao avancado com mysql e projeto) do Hora de codar💛
Se gostou, deixa uma ⭐ no repositório 😄
