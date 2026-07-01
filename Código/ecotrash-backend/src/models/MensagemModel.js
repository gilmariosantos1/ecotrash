const db = require('../config/database');

const MensagemModel = {
  criar(dados, callback) {
    const { nome, email, assunto, mensagem } = dados;
    const dataEnvio = new Date().toLocaleDateString('pt-BR');
    const query = `INSERT INTO mensagens (nome, email, assunto, mensagem, dataEnvio) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [nome, email, assunto, mensagem, dataEnvio], callback);
  }
};

module.exports = MensagemModel;
