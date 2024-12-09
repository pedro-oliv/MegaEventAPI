const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Obter todas as inscrições
router.get('/', (req, res) => {
  const query = `
    SELECT r.id, r.user_id AS userId, r.event_id AS eventId, 
           u.name AS userName, e.name AS eventName 
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    JOIN events e ON r.event_id = e.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Criar uma nova inscrição
router.post('/', (req, res) => {
  const { userId, eventId } = req.body;

  // Verificar se o evento tem slots disponíveis
  const slotsQuery = `
    SELECT slots, 
           (SELECT COUNT(*) FROM registrations WHERE event_id = ?) AS registered_count 
    FROM events 
    WHERE id = ?`;

  db.get(slotsQuery, [eventId, eventId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao verificar slots disponíveis.' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    const { slots, registered_count } = row;

    if (registered_count >= slots) {
      return res.status(400).json({ error: 'O evento já está lotado.' });
    }

    // Criar a inscrição se houver slots disponíveis
    const insertQuery = `INSERT INTO registrations (user_id, event_id) VALUES (?, ?)`;
    db.run(insertQuery, [userId, eventId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
  });
});

// Atualizar uma inscrição
router.put('/:id', (req, res) => {
  const { userId, eventId } = req.body;
  const query = `UPDATE registrations SET user_id = ?, event_id = ? WHERE id = ?`;
  db.run(query, [userId, eventId, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Deletar uma inscrição
router.delete('/:id', (req, res) => {
  const registrationId = req.params.id;

  // Mover a inscrição para o histórico
  const moveToHistoryQuery = `
    INSERT INTO event_history (user_id, event_id, event_name, event_date)
    SELECT r.user_id, r.event_id, e.name, e.date
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.id = ?
  `;

  db.run(moveToHistoryQuery, [registrationId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao mover inscrição para o histórico.' });
    }

    // Deletar a inscrição após movê-la para o histórico
    const deleteRegistrationQuery = `DELETE FROM registrations WHERE id = ?`;

    db.run(deleteRegistrationQuery, [registrationId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar inscrição.' });
      }

      res.json({ message: 'Inscrição deletada e movida para o histórico com sucesso.' });
    });
  });
});



module.exports = router;
