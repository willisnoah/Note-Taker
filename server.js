const path = require('path');
const express = require('express');
const PORT = 3001;
const app = express();
const bodyParse = require('body-parser');
let db = require('./db/db.json');
const fs = require('fs');

const publicFolder = path.join(__dirname, 'public');

app.use(express.static(publicFolder));
app.use(express.json());
app.use(bodyParse.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(publicFolder, 'notes.html'))
});

app.post('/api/notes', (req,res) => {
    console.log(`${req.method} request recieved to post a note`);
    const noteWithId = {...req.body, id:db.length+1}
    db.push(noteWithId);
    fs.writeFile('db/db.json', JSON.stringify(db), () => {
        res.status(200).json({message: "Note successfully posted", data: db});
    })
});

app.get('/api/notes', (req, res) => {
    res.json(db);
})

app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;
    console.log(noteId);
    let updatedData = db.filter(note => note.id !=noteId);
    db = updatedData;
    console.log(db);
    fs.writeFile('db/db.json', JSON.stringify(db), 
    () => {
        res.json({message: "Note successfully deleted", data: db})
    })
});

app.listen(PORT, () => {
    (`Listening on http://localhost:${PORT}`);
});