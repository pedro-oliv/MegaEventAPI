const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Criar evento
router.post('/', (req, res) => {
  const { name, location, date, type, slots } = req.body;
  db.run(
    `INSERT INTO events (name, location, date, type, slots) VALUES (?, ?, ?, ?, ?)`,
    [name, location, date, type, slots],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Listar eventos
router.get('/', (req, res) => {
  db.all(`SELECT * FROM events`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Atualizar evento
router.put('/:id', (req, res) => {
  const { name, location, date, type, slots } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE events SET name = ?, location = ?, date = ?, type = ?, slots = ? WHERE id = ?`,
    [name, location, date, type, slots, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// Deletar um evento
router.delete('/:id', (req, res) => {
  const eventId = req.params.id;

  // Mover as inscrições para o histórico
  const moveToHistoryQuery = `
    INSERT INTO event_history (user_id, event_id, event_name, event_date)
    SELECT r.user_id, r.event_id, e.name, e.date
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE e.id = ?
  `;

  db.run(moveToHistoryQuery, [eventId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao mover inscrições para o histórico.' });
    }

    // Deletar o evento e as inscrições
    const deleteRegistrationsQuery = `DELETE FROM registrations WHERE event_id = ?`;
    const deleteEventQuery = `DELETE FROM events WHERE id = ?`;

    db.run(deleteRegistrationsQuery, [eventId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao deletar inscrições.' });
      }

      db.run(deleteEventQuery, [eventId], function (err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao deletar evento.' });
        }

        res.json({ message: 'Evento e inscrições deletados com sucesso.' });
      });
    });
  });
});

// Filtrar evento
router.get('/', (req, res) => {
  const { date, type, location } = req.query;
  let query = `SELECT * FROM events WHERE 1=1`;
  const params = [];

  if (date) {
    query += ` AND date = ?`;
    params.push(date);
  }
  if (type) {
    query += ` AND type LIKE ?`;
    params.push(`%${type}%`);
  }
  if (location) {
    query += ` AND location LIKE ?`;
    params.push(`%${location}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


module.exports = router;
