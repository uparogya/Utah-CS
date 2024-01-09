const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5080;

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, 'build')));

// Serve the PDF file from the pdfs directory
app.use('/wp-content/uploads/2019/08/', express.static(path.join(__dirname, 'wp-content', 'uploads', '2019', '08')));

// All other GET requests will return the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

