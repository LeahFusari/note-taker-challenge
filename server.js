const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

// middleware to recognize incoming req as string or array
app.use(express.urlencoded({ extended: true }));
// middleware to recognize incoming req as JSON
app.use(express.json());
// middleware to use any assets in the public folder
app.use(express.static('public'));

const savedNotes = require('./db/db.json');

app.get('/api/notes', (req, res) => {
  res.json(savedNotes);
});


function saveNewNote(body, notesArr) {
  const newNote = body;
  if (!Array.isArray(notesArr)) //if there is no array, create one called notesArr
   notesArr = [];
  
  if (notesArr.length === 0)
      notesArr.push(0);

  body.id = notesArr[0];
  notesArr[0]++;

  notesArr.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArr, null, 1) //makes the json more readable in the db.json
  );
  return newNote;
}

app.post('/api/notes', (req, res) => {
  const newNote = saveNewNote(req.body, savedNotes);
  res.json(newNote);
});



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
  });