const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// =======================================================================
// CONFIGURAÇÃO DO SEU GMAIL (Blindado na Porta 465)
// =======================================================================
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,          // Mudamos para a porta 465
  secure: true,       // Ligamos a criptografia máxima (SSL)
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

// =======================================================================
// BANCO DE DADOS E TABELAS
// =======================================================================
const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err.message);
  else {
    console.log('✅ Conectado ao banco de dados SQLite.');
    
    db.run(`CREATE TABLE IF NOT EXISTS coletas (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, cpf TEXT, email TEXT, telefone TEXT,
      estado TEXT, cidade TEXT, bairro TEXT, rua TEXT, tipoLixo TEXT, status TEXT, dataRequisicao TEXT, dataColeta TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS municipios (
      id INTEGER PRIMARY KEY AUTOINCREMENT, estado TEXT, cidade TEXT, emailOficial TEXT UNIQUE, telefone TEXT, senha TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, assunto TEXT, mensagem TEXT, dataEnvio TEXT
    )`);
  }
});

// =======================================================================
// ROTAS DOS CIDADÃOS (COLETAS)
// =======================================================================
app.post('/api/coletas', (req, res) => {
  const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = req.body;
  const status = 'Em análise';
  const dataRequisicao = new Date().toLocaleDateString('pt-BR');
  const dataColeta = 'Aguardando prefeitura';

  const query = `INSERT INTO coletas (nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo, status, dataRequisicao, dataColeta], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    
    // Envia e-mail para o cidadão
    enviarEmail(email, 'Pedido Recebido - EcoTrash', `Olá, ${nome}! Recebemos a sua solicitação de coleta de ${tipoLixo} na ${rua}, ${bairro}. Você pode acompanhar o status pelo site usando o seu CPF.`);

    // Busca a prefeitura e avisa ela também
    db.get(`SELECT emailOficial FROM municipios WHERE estado = ? AND cidade = ?`, [estado, cidade], (err, row) => {
      if (row && row.emailOficial) {
        enviarEmail(row.emailOficial, 'Nova Coleta Solicitada - EcoTrash', `Atenção! Uma nova coleta de ${tipoLixo} foi solicitada por ${nome} no bairro ${bairro}. Acesse o Painel do Município para agendar a data.`);
      }
    });

    res.status(201).json({ mensagem: 'Requerimento salvo!', id: this.lastID });
  });
});

app.get('/api/coletas/cidadao/:cpf', (req, res) => {
  db.all(`SELECT * FROM coletas WHERE cpf = ? ORDER BY id DESC`, [req.params.cpf], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.put('/api/coletas/:id', (req, res) => {
  const { status, dataColeta } = req.body;
  db.run(`UPDATE coletas SET status = ?, dataColeta = ? WHERE id = ?`, [status, dataColeta, req.params.id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Atualizado com sucesso!' });
  });
});

// =======================================================================
// ROTAS DO MUNICÍPIO
// =======================================================================
app.get('/api/coletas/municipio/:estado/:cidade', (req, res) => {
  const { estado, cidade } = req.params;
  db.all(`SELECT * FROM coletas WHERE estado = ? AND cidade = ? ORDER BY id DESC`, [estado, cidade], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post('/api/municipios', (req, res) => {
  const { estado, cidade, emailOficial, telefone, senha } = req.body;
  const query = `INSERT INTO municipios (estado, cidade, emailOficial, telefone, senha) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [estado, cidade, emailOficial, telefone, senha], function(err) {
    if (err) return res.status(400).json({ erro: 'Este e-mail já está cadastrado ou houve um erro.' });
    
    enviarEmail(emailOficial, 'Bem-vindo ao EcoTrash!', `O município de ${cidade}/${estado} foi cadastrado com sucesso no nosso sistema de gestão de resíduos inteligentes.`);
    res.status(201).json({ mensagem: 'Município cadastrado com sucesso!' });
  });
});

app.post('/api/municipios/login', (req, res) => {
  const { email, senha } = req.body;
  db.get(`SELECT * FROM municipios WHERE emailOficial = ? AND senha = ?`, [email, senha], (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (row) res.json({ mensagem: 'Acesso permitido!', cidade: row.cidade, estado: row.estado });
    else res.status(401).json({ erro: 'E-mail ou senha incorretos!' });
  });
});

app.put('/api/municipios/senha', (req, res) => {
  const { email, novaSenha } = req.body;
  db.run(`UPDATE municipios SET senha = ? WHERE emailOficial = ?`, [novaSenha, email], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    if (this.changes === 0) return res.status(404).json({ erro: 'E-mail oficial não encontrado no sistema.' });
    
    enviarEmail(email, 'Sua Senha foi Alterada - EcoTrash', 'Olá! A senha de acesso ao Painel do Município do EcoTrash foi alterada com sucesso. Se não foi você quem alterou, entre em contato com o suporte imediatamente.');
    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  });
});

// =======================================================================
// ROTA DE MENSAGENS (FALE CONOSCO)
// =======================================================================
// =======================================================================
// ROTA DE MENSAGENS (FALE CONOSCO)
// =======================================================================
app.post('/api/mensagens', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  const dataEnvio = new Date().toLocaleDateString('pt-BR');
  const query = `INSERT INTO mensagens (nome, email, assunto, mensagem, dataEnvio) VALUES (?, ?, ?, ?, ?)`;
  
  db.run(query, [nome, email, assunto, mensagem, dataEnvio], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    
    // 1. 📧 E-mail de RECIBO para o cidadão
    enviarEmail(
      email, 
      `Recebemos seu contato: ${assunto} - EcoTrash`, 
      `Olá, ${nome}!\n\nRecebemos a sua mensagem: "${mensagem}".\n\nA nossa equipe vai ler e entrará em contato em breve.\n\nJuntos por um planeta mais feliz!\nEquipe EcoTrash`
    );

    // 2. 📧 E-mail de ALERTA para a administração (O seu e-mail)
    enviarEmail(
      'ecotrashsistema@gmail.com', // 👈 Vai chegar direto na sua caixa!
      `NOVA MENSAGEM NO SITE: ${assunto}`, 
      `Você recebeu um novo contato pelo formulário do site!\n\nNome do Cidadão: ${nome}\nE-mail para resposta: ${email}\nAssunto: ${assunto}\n\nMensagem:\n"${mensagem}"\n\nData de envio: ${dataEnvio}`
    );

    res.status(201).json({ sucesso: true });
  });
});

app.listen(5000, () => {
  console.log(`🚀 Servidor a correr na porta 5000`);
});
// =======================================================================
// ROTA: RECUPERAR SENHA DO MUNICÍPIO (Gera e Envia por E-mail)
// =======================================================================
app.post('/api/municipios/recuperar-senha', (req, res) => {
  const { email } = req.body;
  
  // Gera uma senha aleatória de 6 números (ex: 482910)
  const senhaTemporaria = Math.floor(100000 + Math.random() * 900000).toString();

  db.run(`UPDATE municipios SET senha = ? WHERE emailOficial = ?`, [senhaTemporaria, email], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    
    // Se não encontrou o e-mail no banco
    if (this.changes === 0) return res.status(404).json({ erro: 'E-mail oficial não encontrado no sistema.' });
    
    // 📧 Envia a senha nova pelo nosso servidor blindado!
    enviarEmail(
      email, 
      'Recuperação de Senha - EcoTrash', 
      `Olá!\n\nVocê solicitou a recuperação de senha do Painel do Município.\nSua nova senha de acesso é: ${senhaTemporaria}\n\nGuarde esta senha em segurança.\n\nEquipe EcoTrash`
    );
    
    res.json({ mensagem: 'Uma nova senha foi gerada e enviada para o seu e-mail!' });
  });
});