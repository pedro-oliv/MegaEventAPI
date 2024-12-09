const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Criar usuário
router.post('/', (req, res) => {
  const { name, email } = req.body;
  db.run(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Listar usuários
router.get('/', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Atualizar usuário
router.put('/:id', (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE users SET name = ?, email = ? WHERE id = ?`,
    [name, email, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ updated: this.changes });
      }
    }
  );
});

// Deletar usuário
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ deleted: this.changes });
    }
  });
});

// Busca de eventos passados
router.get('/:id/registrations', (req, res) => {
  const userId = req.params.id;
  const activeQuery = `
    SELECT e.* FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = ? AND e.date >= date('now')
  `;
  const pastQuery = `
    SELECT e.* FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = ? AND e.date < date('now')
  `;

  db.all(activeQuery, [userId], (err, activeEvents) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all(pastQuery, [userId], (err, pastEvents) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ activeEvents, pastEvents });
    });
  });
});

// Obter histórico de eventos de um usuário
router.get('/:id/history', (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT event_id AS eventId, event_name AS eventName, event_date AS eventDate
    FROM event_history
    WHERE user_id = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar histórico de eventos.' });
    }
    res.json(rows);
  });
});



module.exports = router;
