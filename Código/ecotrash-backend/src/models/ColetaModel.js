const db = require('../config/database');

const ColetaModel = {
  criar(dados, callback) {
    const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = dados;
    const status = 'Em análise';
    const dataRequisicao = new Date().toLocaleDateString('pt-BR');
    const dataColeta = 'Aguardando prefeitura';

    const query = `INSERT INTO coletas
      (nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta], callback);
  },

  buscarPorCpf(cpf, callback) {
    db.all(`SELECT * FROM coletas WHERE cpf = ? ORDER BY id DESC`, [cpf], callback);
  },

  buscarPorMunicipio(estado, cidade, callback) {
    db.all(`SELECT * FROM coletas WHERE estado = ? AND cidade = ? ORDER BY id DESC`, [estado, cidade], callback);
  },

  buscarPorId(id, callback) {
    db.get(`SELECT * FROM coletas WHERE id = ?`, [id], callback);
  },

  atualizar(id, status, dataColeta, callback) {
    db.run(`UPDATE coletas SET status = ?, dataColeta = ? WHERE id = ?`, [status, dataColeta, id], callback);
  }
};

module.exports = ColetaModel;
