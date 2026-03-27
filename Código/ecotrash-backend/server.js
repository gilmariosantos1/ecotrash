const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err.message);
  else {
    console.log('✅ Conectado ao banco de dados SQLite.');
    
    db.run(`CREATE TABLE IF NOT EXISTS coletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, cpf TEXT, email TEXT, telefone TEXT,
      estado TEXT, cidade TEXT, bairro TEXT, rua TEXT,
      tipoLixo TEXT, status TEXT, dataRequisicao TEXT, dataColeta TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS municipios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estado TEXT, cidade TEXT, emailOficial TEXT UNIQUE, telefone TEXT, senha TEXT
    )`);

    // NOVA: Tabela para guardar as mensagens do "Fale Conosco"
    db.run(`CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, email TEXT, assunto TEXT, mensagem TEXT, dataEnvio TEXT
    )`);
  }
});

// =======================================================================
// ROTAS DOS CIDADÃOS (COLETAS)
// =======================================================================
app.post('/api/coletas', (req, res) => {
  const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = req.body;
  const status = 'Em análise';
  const dataRequisicao = new Date().toLocaleDateString('pt-BR');
  const dataColeta = 'Aguardando prefeitura';

  const query = `INSERT INTO coletas (nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ mensagem: 'Requerimento salvo!', id: this.lastID });
  });
});

app.get('/api/coletas/cidadao/:cpf', (req, res) => {
  db.all(`SELECT * FROM coletas WHERE cpf = ? ORDER BY id DESC`, [req.params.cpf], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.put('/api/coletas/:id', (req, res) => {
  const { status, dataColeta } = req.body;
  db.run(`UPDATE coletas SET status = ?, dataColeta = ? WHERE id = ?`, [status, dataColeta, req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Atualizado com sucesso!' });
  });
});

// =======================================================================
// ROTAS DO MUNICÍPIO (LOGIN E CADASTRO)
// =======================================================================
app.get('/api/coletas/municipio/:estado/:cidade', (req, res) => {
  const { estado, cidade } = req.params;
  db.all(`SELECT * FROM coletas WHERE estado = ? AND cidade = ? ORDER BY id DESC`, [estado, cidade], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post('/api/municipios', (req, res) => {
  const { estado, cidade, emailOficial, telefone, senha } = req.body;
  const query = `INSERT INTO municipios (estado, cidade, emailOficial, telefone, senha) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [estado, cidade, emailOficial, telefone, senha], function(err) {
    if (err) return res.status(400).json({ erro: 'Este e-mail já está cadastrado ou houve um erro.' });
    res.status(201).json({ mensagem: 'Município cadastrado com sucesso!' });
  });
});

app.post('/api/municipios/login', (req, res) => {
  const { email, senha } = req.body;
  db.get(`SELECT * FROM municipios WHERE emailOficial = ? AND senha = ?`, [email, senha], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (row) {
      res.json({ mensagem: 'Acesso permitido!', cidade: row.cidade, estado: row.estado });
    } else {
      res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    }
  });
});

// =======================================================================
// ROTA DO FALE CONOSCO (MENSAGENS)
// =======================================================================
app.post('/api/mensagens', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  const dataEnvio = new Date().toLocaleDateString('pt-BR');

  const query = `INSERT INTO mensagens (nome, email, assunto, mensagem, dataEnvio) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [nome, email, assunto, mensagem, dataEnvio], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ sucesso: true });
  });
});

app.listen(5000, () => {
  console.log(`🚀 Servidor a correr na porta 5000`);
});