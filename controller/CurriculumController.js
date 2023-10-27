const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Criar currículo
async function createCurriculum(req, res) {
  try {
    const { name, telephone, adress, experience, education } = req.body;
    const query = 'INSERT INTO curriculum (name, telephone, adress, experience, education) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, telephone, adress, experience, education];

    //Exibindo querys no console
    console.log('Query:', query);
    console.log('Values:', values);

    const result = await pool.query(query, values);

    console.log('Insert result:', result.rows[0]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erro ao criar o Currículo' });
  }
}

// Atualizar currículo
async function updateCurriculum(req, res) {
  try {
    const { id } = req.params;
    const { name, telephone, adress, experience, education } = req.body;
    const query = 'UPDATE curriculum SET name = $1, telephone = $2, adress = $3, experience = $4, education = $5 WHERE id = $6 RETURNING *';
    const values = [name, telephone, adress, experience, education, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar o Currículo' });
  }
}

// Pegar currículo por ID
async function getCurriculumById(req, res) {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM curriculum WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar o Currículo por ID' });
  }
}

// Deletar um currículo por ID
async function deleteCurriculum(req, res) {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM curriculum WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Currículo não encontrado' });
    }

    return res.status(204).send(); // 204 não retornará conteúdo após a exclusão bem-sucedida
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao apagar o Currículo por ID' });
  }
}

// Listar currículos
async function listCurriculums(req, res) {
  try {
    const query = 'SELECT * FROM curriculum';
    const result = await pool.query(query);

    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar os Currículos' });
  }
}

module.exports = {
  createCurriculum,
  updateCurriculum,
  getCurriculumById,
  listCurriculums,
  deleteCurriculum,
};
