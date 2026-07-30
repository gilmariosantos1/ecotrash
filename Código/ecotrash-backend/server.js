require('dotenv').config();

const express = require('express');
const cors = require('cors');

const coletaRoutes = require('./src/routes/coletaRoutes');
const municipioRoutes = require('./src/routes/municipioRoutes');
const mensagemRoutes = require('./src/routes/mensagemRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/coletas', coletaRoutes);
app.use('/api/municipios', municipioRoutes);
app.use('/api/mensagens', mensagemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
});
