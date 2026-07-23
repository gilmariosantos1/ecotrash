const express = require('express');
const cors = require('cors');

const coletaRoutes = require('./src/routes/coletaRoutes');
const municipioRoutes = require('./src/routes/municipioRoutes');
const mensagemRoutes = require('./src/routes/mensagemRoutes');
const { initializeDatabase } = require('./src/config/database');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/coletas', coletaRoutes);
app.use('/api/municipios', municipioRoutes);
app.use('/api/mensagens', mensagemRoutes);

initializeDatabase()
  .then(() => {
    app.listen(5000, () => {
      console.log('🚀 Servidor a correr na porta 5000');
    });
  })
  .catch((err) => {
    console.error('Erro ao inicializar o banco:', err.message);
    process.exit(1);
  });
