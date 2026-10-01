import express from 'express';

const app = express();
const PORT = 5000;

// Middleware: incoming JSON requests ko parse karne ke liye
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Retail Inventory Management System API is running!');
});

// Server listen
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
