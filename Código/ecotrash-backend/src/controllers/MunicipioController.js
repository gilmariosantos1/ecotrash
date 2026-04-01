const MunicipioModel = require('../models/MunicipioModel');
const { enviarEmail } = require('../config/mailer');

const MunicipioController = {
  criar(req, res) {
    const { estado, cidade, emailOficial, telefone, senha } = req.body;

    MunicipioModel.criar({ estado, cidade, emailOficial, telefone, senha }, function (err) {
      if (err) return res.status(400).json({ erro: 'Este e-mail já está cadastrado ou houve um erro.' });

      enviarEmail(emailOficial, 'Bem-vindo ao EcoTrash!',
        `O município de ${cidade}/${estado} foi cadastrado com sucesso no nosso sistema de gestão de resíduos inteligentes.`
      );

      res.status(201).json({ mensagem: 'Município cadastrado com sucesso!' });
    });
  },

  login(req, res) {
    const { email, senha } = req.body;
    MunicipioModel.buscarPorEmailESenha(email, senha, (err, row) => {
      if (err) return res.status(500).json({ erro: err.message });
      if (row) res.json({ mensagem: 'Acesso permitido!', cidade: row.cidade, estado: row.estado });
      else res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
    });
  },

  atualizarSenha(req, res) {
    const { email, novaSenha } = req.body;
    MunicipioModel.atualizarSenha(email, novaSenha, function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: 'E-mail oficial não encontrado no sistema.' });

      enviarEmail(email, 'Sua Senha foi Alterada - EcoTrash',
        'Olá! A senha de acesso ao Painel do Município do EcoTrash foi alterada com sucesso. Se não foi você quem alterou, entre em contato com o suporte imediatamente.'
      );

      res.json({ mensagem: 'Senha redefinida com sucesso!' });
    });
  },

  recuperarSenha(req, res) {
    const { email } = req.body;
    const senhaTemporaria = Math.floor(100000 + Math.random() * 900000).toString();

    MunicipioModel.atualizarSenha(email, senhaTemporaria, function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      if (this.changes === 0) return res.status(404).json({ erro: 'E-mail oficial não encontrado no sistema.' });

      enviarEmail(email, 'Recuperação de Senha - EcoTrash',
        `Olá!\n\nVocê solicitou a recuperação de senha do Painel do Município.\nSua nova senha de acesso é: ${senhaTemporaria}\n\nGuarde esta senha em segurança.\n\nEquipe EcoTrash`
      );

      res.json({ mensagem: 'Uma nova senha foi gerada e enviada para o seu e-mail!' });
    });
  }
};

module.exports = MunicipioController;
