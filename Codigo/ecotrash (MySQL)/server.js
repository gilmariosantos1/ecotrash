require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const bcrypt     = require('bcrypt');
const mysql      = require('mysql2/promise');
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

/* ============================================================
   CONEXÃO — parse manual da URI + SSL (obrigatório Clever Cloud)
   ============================================================ */
function criarPool() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('❌ DATABASE_URL não definida no .env');
    process.exit(1);
  }

  // Parse manual evita bugs do mysql2 com certos caracteres especiais na senha
  const url = new URL(uri);
  return mysql.createPool({
    host:               url.hostname,
    port:               parseInt(url.port) || 3306,
    user:               decodeURIComponent(url.username),
    password:           decodeURIComponent(url.password),
    database:           url.pathname.replace(/^\//, ''),
    // SSL — Clever Cloud exige isso para conexões externas
    ssl:                { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit:    10,
    charset:            'utf8mb4',
  });
}

const pool = criarPool();

/* ── Multer ── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req, file, cb) =>
    cb(null, `coleta-${Date.now()}${path.extname(file.originalname) || '.jpg'}`),
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

/* ── Map banco → frontend ── */
const mapColeta = (r) => ({
  id:             r.id,
  nome:           r.nome,
  cpf:            r.cpf,
  email:          r.email,
  telefone:       r.telefone,
  estado:         r.estado,
  cidade:         r.cidade,
  bairro:         r.bairro,
  rua:            r.rua,
  tipoLixo:       r.tipo_lixo,
  status:         r.status,
  dataRequisicao: r.data_requisicao
    ? new Date(r.data_requisicao).toLocaleDateString('pt-BR') : '',
  dataColeta:     r.data_coleta || null,
  latitude:       r.latitude  ? parseFloat(r.latitude)  : null,
  longitude:      r.longitude ? parseFloat(r.longitude) : null,
  fotoPath:       r.foto_path || null,
});

/* ============================================================
   COLETAS
   ============================================================ */
app.post('/api/coletas', upload.single('foto'), async (req, res) => {
  const { nome, cpf, email, telefone, estado, cidade,
          bairro, rua, tipoLixo, latitude, longitude } = req.body;
  if (!nome || !cpf || !estado || !cidade || !tipoLixo)
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  const fotoPath = req.file ? req.file.filename : null;
  try {
    const [r] = await pool.execute(
      `INSERT INTO coletas
         (nome,cpf,email,telefone,estado,cidade,bairro,rua,
          tipo_lixo,status,data_requisicao,latitude,longitude,foto_path)
       VALUES (?,?,?,?,?,?,?,?,?,'Em análise',CURDATE(),?,?,?)`,
      [nome,cpf,email,telefone,estado,cidade,bairro,rua,tipoLixo,
       latitude||null, longitude||null, fotoPath],
    );
    res.status(201).json({ id: r.insertId, mensagem: 'Coleta solicitada!' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro ao criar coleta.' }); }
});

app.get('/api/coletas/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM coletas WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: 'Não encontrado.' });
    res.json(mapColeta(rows[0]));
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.get('/api/coletas/cidadao/:cpf', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM coletas WHERE cpf=? ORDER BY created_at DESC', [req.params.cpf]);
    res.json(rows.map(mapColeta));
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.get('/api/coletas/municipio/:estado/:cidade', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM coletas WHERE estado=? AND cidade=? ORDER BY created_at DESC',
      [req.params.estado, req.params.cidade]);
    res.json(rows.map(mapColeta));
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.put('/api/coletas/:id', async (req, res) => {
  const { status, dataColeta } = req.body;
  try {
    await pool.execute(
      'UPDATE coletas SET status=?,data_coleta=? WHERE id=?',
      [status, dataColeta||null, req.params.id]);
    res.json({ mensagem: 'Atualizado.' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.delete('/api/coletas/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT foto_path FROM coletas WHERE id=?', [req.params.id]);
    if (rows.length && rows[0].foto_path) {
      const f = path.join(UPLOADS_DIR, rows[0].foto_path);
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    const [r] = await pool.execute('DELETE FROM coletas WHERE id=?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ erro: 'Não encontrado.' });
    res.json({ mensagem: 'Excluído.' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

/* ============================================================
   MUNICÍPIOS
   ============================================================ */
app.post('/api/municipios', async (req, res) => {
  const { emailOficial, senha, telefone, estado, cidade, codigoAdmin } = req.body;
  if (codigoAdmin !== (process.env.ADMIN_CODE || 'ecotrash@2025'))
    return res.status(403).json({ erro: 'Código de autorização inválido.' });
  if (!emailOficial || !senha || !estado || !cidade)
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  try {
    const [ex] = await pool.execute('SELECT id FROM municipios WHERE email_oficial=?', [emailOficial]);
    if (ex.length) return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    const hash = await bcrypt.hash(senha, 10);
    await pool.execute(
      'INSERT INTO municipios (email_oficial,senha,telefone,estado,cidade) VALUES (?,?,?,?,?)',
      [emailOficial, hash, telefone, estado, cidade]);
    res.status(201).json({ mensagem: 'Município cadastrado!' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.post('/api/municipios/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Informe e-mail e senha.' });
  try {
    const [rows] = await pool.execute('SELECT * FROM municipios WHERE email_oficial=?', [email]);
    if (!rows.length) return res.status(401).json({ erro: 'Credenciais inválidas.' });
    if (!await bcrypt.compare(senha, rows[0].senha))
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    res.json({ cidade: rows[0].cidade, estado: rows[0].estado });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

app.post('/api/municipios/recuperar-senha', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ erro: 'Informe o e-mail.' });
  try {
    const [rows] = await pool.execute('SELECT id FROM municipios WHERE email_oficial=?', [email]);
    if (!rows.length) return res.status(404).json({ erro: 'E-mail não encontrado.' });
    const nova = Math.random().toString(36).slice(-8);
    await pool.execute('UPDATE municipios SET senha=? WHERE email_oficial=?',
      [await bcrypt.hash(nova, 10), email]);
    const t = nodemailer.createTransport({
      service:'gmail', auth:{ user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS }});
    await t.sendMail({ from:`"EcoTrash"<${process.env.EMAIL_USER}>`, to:email,
      subject:'Recuperação de senha — EcoTrash',
      text:`Sua nova senha: ${nova}` });
    res.json({ mensagem: 'Nova senha enviada.' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro ao enviar e-mail.' }); }
});

app.put('/api/municipios/senha', async (req, res) => {
  const { email, novaSenha } = req.body;
  try {
    await pool.execute('UPDATE municipios SET senha=? WHERE email_oficial=?',
      [await bcrypt.hash(novaSenha, 10), email]);
    res.json({ mensagem: 'Senha atualizada.' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

/* ── Mensagens ── */
app.post('/api/mensagens', async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  if (!nome||!email||!assunto||!mensagem)
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  try {
    await pool.execute('INSERT INTO mensagens (nome,email,assunto,mensagem) VALUES (?,?,?,?)',
      [nome,email,assunto,mensagem]);
    res.status(201).json({ mensagem: 'Mensagem enviada!' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Erro interno.' }); }
});

/* ── Start ── */
pool.getConnection()
  .then(conn => {
    conn.release();
    app.listen(PORT, () => {
      console.log(`\n🌱 EcoTrash Backend rodando na porta ${PORT}`);
      console.log(`📦 MySQL conectado!\n`);
    });
  })
  .catch(err => {
    console.error('\n❌ Erro ao conectar ao MySQL:', err.message);
    console.error('   Verifique a DATABASE_URL no .env\n');
    process.exit(1);
  });
