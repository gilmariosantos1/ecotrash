const db = require('../config/database');

const MunicipioModel = {
  criar(dados, callback) {
    const { estado, cidade, emailOficial, telefone, senha } = dados;
    const query = `INSERT INTO municipios (estado, cidade, emailOficial, telefone, senha) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [estado, cidade, emailOficial, telefone, senha], callback);
  },

  buscarPorEmailESenha(email, senha, callback) {
    db.get(`SELECT * FROM municipios WHERE emailOficial = ? AND senha = ?`, [email, senha], callback);
  },

  buscarPorCidade(estado, cidade, callback) {
    db.get(`SELECT emailOficial FROM municipios WHERE estado = ? AND cidade = ?`, [estado, cidade], callback);
  },

  atualizarSenha(email, novaSenha, callback) {
    db.run(`UPDATE municipios SET senha = ? WHERE emailOficial = ?`, [novaSenha, email], callback);
  }
};

module.exports = MunicipioModel;
