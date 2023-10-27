const { Pool } = require('pg');

// configurando pool para conexão com o banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
