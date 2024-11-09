require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');  // bcryptjs for hashing passwords
const cors = require('cors');
const app = express();

//import the database connection 
const db = require('./db_connect');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur notre App de Taches.');
  
});

//TODOS PART

    //Add a task to the db
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

    //retrieve all the tasks
        app.get('/todos', (req, res) => {
            db.query('SELECT * FROM todos', (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(results);
            });
        });


    // DELETE route to remove a todo by ID
        app.delete('/todos/:id', (req, res) => {
            const { id } = req.params;
        
            // Query to delete a specific todo based on ID
            const sql = 'DELETE FROM todos WHERE id = ?';
        
            db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error deleting todo:', err);
                return res.status(500).json({ error: 'Failed to delete todo.' });
            }
        
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Todo not found.' });
            }
        
            res.status(200).json({ message: 'Todo deleted successfully.' });
            });
        });


//USERS PART

// Signup Route (Register User)
app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password, date_creation } = req.body;
  
    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
  
      if (result.length > 0) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into database
      const sql = 'INSERT INTO users (firstname, lastname, email, password, date_creation) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [firstname, lastname, email, hashedPassword, date_creation], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Failed to register user.' });
        }
  
        res.status(201).json({ message: 'User registered successfully!' });
      });
    });
  });
  
  // Signin Route (Login User)
  app.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Database error.' });
      }
  
      if (result.length === 0) {
        return res.status(400).json({ message: 'User not found.' });
      }
  
      // Compare the entered password with the hashed password
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password.' });
      }
  
      // Successful login
      res.status(200).json({ message: 'Login successful!', userId: user.id });
    });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(process.env.MYSQL_PUBLIC_URL);
});
