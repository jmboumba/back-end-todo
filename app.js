require('dotenv').config();
const express = require('express');
const app = express();

//import the database connection 
const db = require('./db_connect');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur notre App de Taches.');
});

app.post('/todos', (req, res) => {
    
    const { title, date, description, user_id } = req.body;

    const sql = 'INSERT INTO todos (title, date, description, user_id) VALUES (?, ?, ?, ?)';

    db.query(sql, [title, date, description, user_id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating task');
        } else {
            res.status(200).send('Task is created successfully');
        }
    });
});

app.get('/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.json(results);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
