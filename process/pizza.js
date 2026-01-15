const { Int } = require("mssql");

module.exports = function registerPizzaRoutes(app, pool) {

  // Rota para buscar sabores
  app.get('/api/sabores', async (req, res) => {
    try {
      const request = pool.request();
      const result = await request.query('SELECT * FROM sabores');
      res.json(result.recordset || []);
    } catch (err) {
      console.error('Erro ao buscar sabores:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Rota para buscar bordas
  app.get('/api/bordas', async (req, res) => {
    try {
      const request = pool.request();
      const result = await request.query('SELECT * FROM bordas');
      res.json(result.recordset || []);
    } catch (err) {
      console.error('Erro ao buscar bordas:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Rota para buscar massas
  app.get('/api/massas', async (req, res) => {
    try {
      const request = pool.request();
      const result = await request.query('SELECT * FROM massas');
      res.json(result.recordset || []);
    } catch (err) {
      console.error('Erro ao buscar massas:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Rota para enviar as pizzas
  app.post('/api/pizzas', async (req, res) => {
    try {
      const { bordas_id, massas_id} = req.body;
      const request = pool.request();
      request.input('bordas_id', Int, bordas_id);
      request.input('massas_id', Int, massas_id);
      
      const result = await request.query(
        'INSERT INTO pizzas (bordas_id, massas_id) VALUES (@bordas_id, @massas_id); SELECT SCOPE_IDENTITY() as pizza_id;'
      );
      
      const pizza_id = result.recordset[0].pizza_id;
      
      res.json({ 
        pizza_id,
        bordas_id,
        massas_id
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Rota para enviar pedido
  app.post('/api/pedidos', async (req, res) => {
    try {
      const { pizzas_id, status_id } = req.body;
      const request = pool.request();
      request.input('pizzas_id', Int, pizzas_id);
      request.input('status_id', Int, status_id);
      
      const result = await request.query(
        'INSERT INTO pedidos (pizzas_id, status_id) VALUES (@pizzas_id, @status_id); SELECT SCOPE_IDENTITY() as pedido_id;'
      );

      const pizza_id = result.recordset[0].pizza_id;

      res.json({ 
        pizza_id,
        pizzas_id,
        status_id
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
app.post('/api/teste', (req, res) => {
  res.json({ ok: true });
});

};