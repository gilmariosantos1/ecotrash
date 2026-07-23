const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', 'banco.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  }
});

const initializeDatabase = () => new Promise((resolve, reject) => {
  const schema = `
    CREATE TABLE IF NOT EXISTS coletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, cpf TEXT, email TEXT, telefone TEXT,
      estado TEXT, cidade TEXT, bairro TEXT, rua TEXT,
      tipoLixo TEXT, status TEXT, dataRequisicao TEXT, dataColeta TEXT
    );

    CREATE TABLE IF NOT EXISTS municipios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estado TEXT, cidade TEXT, emailOficial TEXT UNIQUE, telefone TEXT, senha TEXT
    );

    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT, email TEXT, assunto TEXT, mensagem TEXT, dataEnvio TEXT
    );
  `;

  db.exec(schema, (err) => {
    if (err) {
      reject(err);
      return;
    }

    console.log(`✅ Banco de dados SQLite preparado em ${dbPath}.`);
    resolve();
  });
});

module.exports = { db, initializeDatabase };
