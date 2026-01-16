require('dotenv').config();

console.log('DB_SERVER =', process.env.DB_SERVER);

const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { Int } = require('mssql');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 1433,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

let pool;

async function connectDB() {
  try {
    pool = await sql.connect(sqlConfig);
    console.log('✓ Conectado ao SQL Server');
  } catch (err) {
    console.error('✗ Erro ao conectar SQL Server:', err.message);
    process.exit(1);
  }
}

// PARA MELHOR ORGANIZAÇÃO, PASSAR FUTURAMENTE PARA O PIZZA.JS

// GET /api/sabores
app.get('/api/sabores', async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM sabores');
    res.json(result.recordset || []);
  } catch (err) {
    console.error('Erro GET /api/sabores:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bordas
app.get('/api/bordas', async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM bordas');
    res.json(result.recordset || []);
  } catch (err) {
    console.error('Erro GET /api/bordas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/massas
app.get('/api/massas', async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM massas');
    res.json(result.recordset || []);
  } catch (err) {
    console.error('Erro GET /api/massas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pizzas
app.post('/api/pizzas', async (req, res) => {
  try {
    const { bordas_id, massas_id } = req.body;
    const request = pool.request();
    request.input('bordas_id', Int, bordas_id);
    request.input('massas_id', Int, massas_id);
    
    const result = await request.query(
      'INSERT INTO pizzas (bordas_id, massas_id) VALUES (@bordas_id, @massas_id); SELECT SCOPE_IDENTITY() as pizza_id;'
    );
    
    const pizza_id = result.recordset[0].pizza_id;
    console.log('✓ Pizza criada: ID =', pizza_id);
    
    res.json({ 
      pizza_id,
      bordas_id,
      massas_id
    });
  } catch (err) {
    console.error('✗ Erro POST /api/pizzas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pizza_sabor
app.post('/api/pizza_sabor', async (req, res) => {
  try {
    const { pizzas_id, sabores_id } = req.body;

    if (!pizzas_id || !sabores_id) {
      return res.status(400).json({ error: 'pizzas_id e sabores_id são obrigatórios' });
    }

    const request = pool.request();
    request.input('pizzas_id', Int, pizzas_id);
    request.input('sabores_id', Int, sabores_id);

    await request.query(
      'INSERT INTO pizza_sabor (pizzas_id, sabores_id) VALUES (@pizzas_id, @sabores_id);'
    );

    console.log('✓ Sabor adicionado: pizza =', pizzas_id, 'sabor =', sabores_id);

    res.json({ pizzas_id, sabores_id });
  } catch (err) {
    console.error('✗ Erro POST /api/pizza_sabor:', err.message);
    res.status(500).json({ error: err.message });
  }
});

//POST /api/pedidos
app.post('/api/pedidos', async (req, res) => {
  try {
    console.log('BODY /api/pedidos:', req.body);
    const {pizzas_id, status_id} = req.body;

    const request = pool.request();
    request.input('pizzas_id', Int, pizzas_id);
    request.input('status_id', Int, status_id);

    await request.query(
      'INSERT INTO pedidos (pizzas_id, status_id) VALUES (@pizzas_id, @status_id); SELECT SCOPE_IDENTITY() as pedido_id;'
    );
    console.log('✓ Pedido criado para pizza ID =', pizzas_id);

    res.json({ 
      pizzas_id,
      status_id
    });
  } catch (err) {
    console.error('✗ Erro POST /api/pedidos:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// FIM DO PIZZA.JS

// PARA MELHOR ORGANIZAÇÃO, PASSAR FUTURAMENTE PARA O ORDERS.JS

// GET/api/PEDIDOS
  app.get('/api/pedidos', async (req, res) => {
    try {
      const result = await pool.request().query(`
        SELECT 
          p.id AS pedido_id,
          p.status_id,
          b.tipo AS borda,
          m.tipo AS massa,
          s.tipo AS sabor
        FROM pedidos p
        JOIN pizzas pi ON pi.id = p.pizzas_id
        JOIN bordas b ON b.id = pi.bordas_id
        JOIN massas m ON m.id = pi.massas_id
        JOIN pizza_sabor ps ON ps.pizzas_id = pi.id
        JOIN sabores s ON s.id = ps.sabores_id
        ORDER BY p.id
      `);

      const pedidosMap = {};

      result.recordset.forEach(row => {
        if (!pedidosMap[row.pedido_id]) {
          pedidosMap[row.pedido_id] = {
            id: row.pedido_id,
            borda: row.borda,
            massa: row.massa,
            status: row.status_id, // depois você pode mapear para texto
            sabores: []
          };
        }

        pedidosMap[row.pedido_id].sabores.push(row.sabor);
      });

      const pedidos = Object.values(pedidosMap);

      console.log('✓ Pedidos formatados:', pedidos);
      res.json(pedidos);

    } catch (error) {
      console.error('✗ Erro GET /api/pedidos:', error.message);
      res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  });
// FIM DO ORDERS.JS

async function start() {
  await connectDB();
  app.listen(port, '127.0.0.1', () => {
    console.log(`✓ Servidor rodando em http://127.0.0.1:${port}`);
  });
}

start().catch(err => {
  console.error('✗ Erro ao iniciar:', err.message);
  process.exit(1);
});