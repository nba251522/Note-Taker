const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error reading notes" });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body; 
    newNote.id = Date.now().toString();
    
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error reading notes" });
      }
      const notes = JSON.parse(data);
      notes.push(newNote);
  
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error writing new note" });
        }
        res.json(newNote);
      });
    });
  });

  app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error reading notes" });
      }
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== noteId);
  
      fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error deleting note" });
        }
        res.json({ message: "Note deleted successfully" });
      });
    });
  });

  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });