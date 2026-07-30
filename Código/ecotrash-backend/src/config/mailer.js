const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const enviarEmail = (destinatario, assunto, texto) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: destinatario,
    subject: assunto,
    text: texto,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log('❌ Erro ao enviar email:', error);
    else console.log('✅ Email enviado para:', destinatario);
  });
};

module.exports = { enviarEmail };
