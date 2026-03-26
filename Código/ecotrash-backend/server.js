const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conectando ao Banco de Dados SQLite (Cria o arquivo banco.sqlite)
const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite.');
    
    // Cria a tabela de coletas se ela não existir
    db.run(`CREATE TABLE IF NOT EXISTS coletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cpf TEXT,
      email TEXT,
      cidade TEXT,
      bairro TEXT,
      rua TEXT,
      status TEXT,
      dataRequisicao TEXT
    )`);
  }
});

// 2. Rota para SALVAR um novo requerimento (Vem do Frontend)
app.post('/api/coletas', (req, res) => {
  const { nome, cpf, email, cidade, bairro, rua } = req.body;
  const status = 'Em análise';
  const dataRequisicao = new Date().toLocaleDateString('pt-BR');

  const query = `INSERT INTO coletas (nome, cpf, email, cidade, bairro, rua, status, dataRequisicao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [nome, cpf, email, cidade, bairro, rua, status, dataRequisicao], function(err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ mensagem: 'Requerimento salvo!', id: this.lastID });
  });
});

// 3. Rota para LISTAR todos os requerimentos (Para o Painel do Município)
app.get('/api/coletas', (req, res) => {
  db.all(`SELECT * FROM coletas`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// 4. Rota para buscar os requerimentos de um cidadão específico (Pelo CPF)
app.get('/api/coletas/cidadao/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  db.all(`SELECT * FROM coletas WHERE cpf = ?`, [cpf], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Ligando o servidor na porta 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});