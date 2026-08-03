// Script utilitário: migra senhas de município de texto puro para hash bcrypt.
// Necessário apenas se o seu banco.sqlite tiver contas de município cadastradas
// ANTES da mudança para bcrypt (ou seja, com senha ainda em texto puro).
// É seguro rodar mais de uma vez: linhas que já estão em hash são ignoradas.
//
// Uso (rodar a partir da pasta ecotrash-backend):
//   node scripts/migrar-senhas-municipio.js

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'banco.sqlite');
const db = new sqlite3.Database(dbPath);

const jaEhHashBcrypt = (valor) => typeof valor === 'string' && /^\$2[aby]\$\d{2}\$/.test(valor);

db.all('SELECT id, senha FROM municipios', [], (err, rows) => {
  if (err) {
    console.error('Erro ao ler municipios:', err.message);
    db.close();
    return;
  }

  if (rows.length === 0) {
    console.log('Nenhum município encontrado. Nada a migrar.');
    db.close();
    return;
  }

  let pendentes = rows.length;
  const finalizar = () => {
    pendentes -= 1;
    if (pendentes === 0) db.close();
  };

  rows.forEach((row) => {
    if (jaEhHashBcrypt(row.senha)) {
      console.log(`Município #${row.id}: já está com hash, pulando.`);
      finalizar();
      return;
    }

    const hash = bcrypt.hashSync(row.senha, 10);
    db.run('UPDATE municipios SET senha = ? WHERE id = ?', [hash, row.id], (updateErr) => {
      if (updateErr) console.error(`Erro ao migrar município #${row.id}:`, updateErr.message);
      else console.log(`Município #${row.id}: senha migrada para hash bcrypt.`);
      finalizar();
    });
  });
});
