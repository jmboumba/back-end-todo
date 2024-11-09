const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

//import the database connection 
const db = require('./db_connect');

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
    db.query(sql, [email, hashedPassword], (err, result) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
