// Require necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

// Create an Express app
const app = express();
app.use(bodyParser.json());

// MongoDB connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'gym_management';

// Connect to MongoDB
let db;
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  db = client.db(dbName);
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user with the same email already exists
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user to MongoDB
  await db.collection('users').insertOne({ name, email, password: hashedPassword });

  res.status(201).send('User created successfully');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }

  // Compare hashed passwords
  if (await bcrypt.compare(password, user.password)) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid password');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
