require('dotenv').config();
const mysql = require('mysql2/promise');

async function testar() {
  console.log('\n🔍 Testando conexão MySQL...');
  const uri = process.env.DATABASE_URL;
  if (!uri) { console.error('❌ DATABASE_URL não definida no .env'); return; }

  const url = new URL(uri);
  console.log(`   Host:     ${url.hostname}`);
  console.log(`   Port:     ${url.port || 3306}`);
  console.log(`   User:     ${decodeURIComponent(url.username)}`);
  console.log(`   Password: ${'*'.repeat(decodeURIComponent(url.password).length)} (${decodeURIComponent(url.password).length} chars)`);
  console.log(`   Database: ${url.pathname.replace(/^\//, '')}`);

  // Tenta COM SSL primeiro
  try {
    const conn = await mysql.createConnection({
      host:     url.hostname,
      port:     parseInt(url.port) || 3306,
      user:     decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ''),
      ssl:      { rejectUnauthorized: false },
    });
    await conn.execute('SELECT 1');
    await conn.end();
    console.log('\n✅ CONECTADO COM SSL! O server.js vai funcionar.\n');
  } catch (e1) {
    console.log(`\n⚠️  COM SSL falhou: ${e1.message}`);

    // Tenta SEM SSL
    try {
      const conn2 = await mysql.createConnection({
        host:     url.hostname,
        port:     parseInt(url.port) || 3306,
        user:     decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
      });
      await conn2.execute('SELECT 1');
      await conn2.end();
      console.log('\n✅ CONECTADO SEM SSL! Remova a linha ssl do server.js.\n');
    } catch (e2) {
      console.log(`\n❌ SEM SSL também falhou: ${e2.message}`);
      console.log('\n→ Verifique a DATABASE_URL no .env e se o banco está ACTIVE no Clever Cloud.\n');
    }
  }
}

testar();
