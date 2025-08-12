require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 3000;

async function start() {
  // db initialization handled inside app.js (it will only try if PG env var present)
  await app.init?.(); // init is optional (exports.init)
  app.listen(port, () => console.log(`listening ${port}`));
}

start().catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
