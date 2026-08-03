const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'ecotrashsistema@gmail.com',
    pass: 'wndyksjjglucijjf'
  }
});

const enviarEmail = (destinatario, assunto, texto) => {
  const mailOptions = {
    from: 'ecotrashsistema@gmail.com',
    to: destinatario,
    subject: assunto,
    text: texto
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('❌ Erro ao enviar email:', error);
    else console.log('✅ Email enviado para:', destinatario);
  });
};

module.exports = { enviarEmail };
