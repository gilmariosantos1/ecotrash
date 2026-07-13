const MensagemModel = require('../models/MensagemModel');
const { enviarEmail } = require('../config/mailer');

const MensagemController = {
  criar(req, res) {
    const { nome, email, assunto, mensagem } = req.body;

    MensagemModel.criar({ nome, email, assunto, mensagem }, function (err) {
      if (err) return res.status(500).json({ erro: err.message });

      enviarEmail(email, `Recebemos seu contato: ${assunto} - EcoTrash`,
        `Olá, ${nome}!\n\nRecebemos a sua mensagem: "${mensagem}".\n\nA nossa equipe vai ler e entrará em contato em breve.\n\nJuntos por um planeta mais feliz!\nEquipe EcoTrash`
      );

      enviarEmail('ecotrashsistema@gmail.com', `NOVA MENSAGEM NO SITE: ${assunto}`,
        `Você recebeu um novo contato pelo formulário do site!\n\nNome do Cidadão: ${nome}\nE-mail para resposta: ${email}\nAssunto: ${assunto}\n\nMensagem:\n"${mensagem}"`
      );

      res.status(201).json({ sucesso: true });
    });
  }
};

module.exports = MensagemController;
