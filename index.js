const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 5000;

// Sample book data
let books = [
    {
        book_id: "101",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        year: 1925,
        copies: 5
    },
    {
        book_id: "102",
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        year: 1949,
        copies: 3
    }
];

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files
app.use(express.static('static'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Create a new book
app.post('/books', (req, res) => {
    const { book_id, title, author, genre, year, copies } = req.body;

    // Input validation
    if (!book_id || !title || !author || !genre || !year || !copies) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);
    res.status(201).json(newBook);
});

// Retrieve all books
app.get('/books', (req, res) => {
    res.json(books);
});

// Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }
    res.json(book);
});

// Update book information
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.book_id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    // Update book details
    const { title, author, genre, year, copies } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;

    res.json(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.book_id === req.params.id);
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    books.splice(bookIndex, 1);
    res.json({ message: 'Book deleted successfully.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Library Management System API listening at http://localhost:${port}`);
});