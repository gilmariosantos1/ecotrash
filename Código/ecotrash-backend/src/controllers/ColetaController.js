const ColetaModel = require('../models/ColetaModel');
const MunicipioModel = require('../models/MunicipioModel');
const { enviarEmail } = require('../config/mailer');

const ColetaController = {
  criar(req, res) {
    const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = req.body;

    ColetaModel.criar({ nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo }, function (err) {
      if (err) return res.status(500).json({ erro: err.message });

      enviarEmail(email, 'Pedido Recebido - EcoTrash',
        `Olá, ${nome}! Recebemos a sua solicitação de coleta de ${tipoLixo} na ${rua}, ${bairro}. Você pode acompanhar o status pelo site usando o seu CPF.`
      );

      MunicipioModel.buscarPorCidade(estado, cidade, (err, row) => {
        if (row && row.emailOficial) {
          enviarEmail(row.emailOficial, 'Nova Coleta Solicitada - EcoTrash',
            `Atenção! Uma nova coleta de ${tipoLixo} foi solicitada por ${nome} no bairro ${bairro}. Acesse o Painel do Município para agendar a data.`
          );
        }
      });

      res.status(201).json({ mensagem: 'Requerimento salvo!', id: this.lastID });
    });
  },

  buscarPorCpf(req, res) {
    ColetaModel.buscarPorCpf(req.params.cpf, (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  },

  buscarPorMunicipio(req, res) {
    const { estado, cidade } = req.params;
    ColetaModel.buscarPorMunicipio(estado, cidade, (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  },

  atualizar(req, res) {
    const { status, dataColeta } = req.body;
    ColetaModel.atualizar(req.params.id, status, dataColeta, function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: 'Atualizado com sucesso!' });
    });
  }
};

module.exports = ColetaController;
