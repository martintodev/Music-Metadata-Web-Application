const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const csv = require('csv-parser');

let genreData, newArray = [];


fs.createReadStream('lab3-data/genres.csv')
.pipe(csv())
.on('data', (rows) => {
    newArray.push(rows)
    genreData = newArray.map((rows) => {
        return {
            'genre_id':rows.genre_id,
            'parent_id':rows.parent,
            'title':rows.title
        }
    });
})
.on ('end', () => {
});



//Setup serving front-end code
app.use('/', express.static('static'));

//Setup middleware to do logging
app.use((req, res, next) => { //For all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); //Keep going
});

//Gets genres
app.get('/api/genres', (req, res) => {
    res.send(genreData);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}); 