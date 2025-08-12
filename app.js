const express = require('express');
const { connectAndInit, query } = require('./db');

const app = express();

app.get('/ping', (req, res) => res.json({ pong: true }));

// DB-backed endpoint (only works if DB env vars configured)
app.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT id, name FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error /users:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// optional initialization function used by index.js / tests
async function init() {
  await connectAndInit();
}
module.exports = app;
module.exports.init = init;
