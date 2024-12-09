const express = require('express');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');
const registrationsRouter = require('./routes/registrations');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.json());
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/registrations', registrationsRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
