const express = require("express");
const admin = require('firebase-admin')
const credentials = require('./firebase_credentials.json')
const app = express();
const port = 8080;
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

  const AuthMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ', '') : null;
  if (!token) {
      return res.status(401).json({ message: 'Acesso não autorizado' });
  }
  try {
      const authUser = await admin.auth().verifyIdToken(token);
      req.authUser = authUser;
      next();

  } catch (e) {
      return res.sendStatus(401);
      
  }
};
app.post('/register', async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const userResponse = await admin.auth().createUser({
      email: user.email,
      password: user.password,
      emailVerified: false,
      disabled: false,
    });
    res.json(userResponse);
  } catch (error) {
    // Tratando o erro de e-mail já existente
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'O endereço de e-mail já está em uso por outra conta.' });
    }
    // Tratando outros erros de autenticação
    return res.status(500).json({ error: 'Erro durante a criação do usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consultando o user pelo e-mail
    const userRecord = await admin.auth().getUserByEmail(email);

    // Verificando a senha do user
    if (userRecord && userRecord.email === email) {
      // User autenticado com sucesso
      return res.status(200).json({ message: "Autenticação bem-sucedida", user: userRecord });
    } else {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (error) {
    // Tratando erros de user não encontrado ou inválido
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
});



const { createCurriculum, updateCurriculum, getCurriculumById, deleteCurriculum, listCurriculums } = require('./controller/CurriculumController');

// Rota para criação do currículo
app.post('/curriculum', createCurriculum);

// Rota para atualização do currículo
app.put('/curriculum/:id', updateCurriculum);

// Rota para buscar o currículo pelo ID
app.get('/curriculum/:id', getCurriculumById);

// Rota para excluir um currículo pelo ID
app.delete('/curriculum/:id', deleteCurriculum);

// Rota para listar todos os currículos
app.get('/curriculum', listCurriculums);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});