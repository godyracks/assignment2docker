// Load the required modules
const express = require('express'); // Handles web requests (like a mini web server)
const bodyParser = require('body-parser'); // Helps read data sent in requests (like form submissions)
const fs = require('fs'); // Lets us work with files (read, write, update)
const path = require('path'); // Helps manage file locations (so it works on all systems)

// Create an Express application (our server)
const app = express();
const PORT = 3000; // The server will run on this port (http://localhost:3000)

// Middleware to automatically convert incoming request data into a usable format (JSON)
app.use(bodyParser.json());

// Set the location where posts will be saved
const filePath = path.join(__dirname, 'posts.txt');

// Serve static files (like posting.html, CSS, and JavaScript)
app.use(express.static(__dirname));

// Route to serve `posting.html` when visiting `/`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'posting.html'));
});

// Define a POST request endpoint to receive and save posts
app.post('/postmessage', (req, res) => {
    // Get 'topic' and 'data' from the request body
    const { topic, data } = req.body;

    // Check if the user provided both a topic and data
    if (!topic || !data) {
        return res.status(400).send('Topic and data are required.');
    }

    // Get the current date and time (to track when the post was made)
    const timestamp = new Date().toISOString();

    // Format the post in a readable way
    const post = `Topic: ${topic}\nData: ${data}\nTimestamp: ${timestamp}\n\n`;

    // Save the post to the 'posts.txt' file
    fs.appendFile(filePath, post, (err) => {
        if (err) {
            console.error(err); // Print error if something goes wrong
            return res.status(500).send('Failed to save the post.');
        }
        res.status(201).send('Post saved successfully.'); // Send a success message back
    });
});

// Start the server and make it listen for requests
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Open in browser: http://localhost:${PORT}/`);
});
