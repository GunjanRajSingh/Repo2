const { Client } = require('pg');

function getClientConfig() {
  if (process.env.PGHOST) {
    return {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
      ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : false
    };
  }
  // No DB config -> return null so caller knows not to connect
  return null;
}

let client;
async function connectAndInit() {
  const cfg = getClientConfig();
  if (!cfg) {
    console.log('No PG env vars found; skipping DB init.');
    return;
  }
  client = new Client(cfg);
  await client.connect();
  // create a small table for demo
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);
  // seed if empty
  const res = await client.query('SELECT count(*)::int as c FROM users;');
  if (res.rows[0].c === 0) {
    await client.query(`INSERT INTO users(name) VALUES ('alice'), ('bob');`);
  }
  console.log('DB connected and initialized');
}

function query(text, params) {
  if (!client) throw new Error('DB client not initialized');
  return client.query(text, params);
}

module.exports = { connectAndInit, query };
