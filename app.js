const express = require("express");
const admin = require('firebase-admin')
const credentials = require('./api-firebase-d5b0e-firebase-adminsdk-9339q-a2a87e52bc.json')
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


app.post('/signup', async(req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false,
  })
  res.json(userResponse)

})


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
