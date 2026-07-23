const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } else {
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

    db.run(`CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, email TEXT, assunto TEXT, mensagem TEXT, dataEnvio TEXT
    )`);
  }
});

module.exports = db;
