const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');

//Creates Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'martin123',
    database: 'playlistdata'
});

//Connect to MySQL
db.connect(err =>  {
    if (err) throw err;
    console.log("Connected to MySQL");
});


let genreDataFinal, genreDataInitial = [];
let artistDataFinal, artistDataInitial = [];
let trackDataFinal, trackDataInitial = [];

let playlists;
let sqlCheck = 'SELECT * FROM playlistnames';
let query = db.query(sqlCheck, (err, results) => {
    if(err) throw err;
    playlists = results;
})



fs.createReadStream('lab3-data/raw_artists.csv')
.pipe(csv())
.on('data', (rows) => {
    artistDataInitial.push(rows)
    artistDataFinal = artistDataInitial.map((rows) => {
        return {
            'artist_id':rows.artist_id,
            'artist_handle':rows.artist_handle,
            'artist_name':rows.artist_name,
            'artist_date_created':rows.artist_date_created,
            'artist_location':rows.artist_location,
            'artist_favorites':rows.artist_favorites,
            'tags':rows.tags
        }
    });
})
.on ('end', () => {
});

fs.createReadStream('lab3-data/genres.csv')
.pipe(csv())
.on('data', (rows) => {
    genreDataInitial.push(rows)
    genreDataFinal = genreDataInitial.map((rows) => {
        return {
            'genre_id':rows.genre_id,
            'parent_id':rows.parent,
            'title':rows.title
        }
    });
})
.on ('end', () => {
});

fs.createReadStream('lab3-data/raw_tracks.csv')
.pipe(csv())
.on('data', (rows) => {
    trackDataInitial.push(rows)
    trackDataFinal = trackDataInitial.map((rows) => {
        return {
            'track_id':rows.track_id,
            'album_id':rows.album_id,
            'album_title':rows.album_title,
            'artist_id':rows.artist_id,
            'artist_name':rows.artist_name,
            'tags':rows.tags,
            'track_date_created':rows.track_date_created,
            'track_date_recorded':rows.track_date_recorded,
            'track_duration':rows.track_duration,
            'track_genres':rows.track_genres,
            'track_number':rows.track_number,
            'track_title':rows.track_title
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

//Parse data in body as JSON
router.use(express.json());

//Create Database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE playlistdata';
    db.query(sql, err => {
        if (err) throw err;
        res.send('Database Created');
    })
})

//Select thing
app.get('/getplaylist', (req, res) => {
    let sql = 'SELECT * FROM playlistnames';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        let test = results;
        console.log(playlists);
        console.log(test);
        res.send('Playlist details fetched');
    })
})



//Gets genres
app.get('/api/genres', (req, res) => {
    res.send(genreDataFinal);
});

//Gets artist from artist ID
app.get('/api/artists/:artist_id', (req, res) => {
    const id = req.params.artist_id;
    const artist = artistDataFinal.find(p => p.artist_id === id);
    if(artist) {
        res.send(artist);
    } else {
        res.status(404).send(`Artist with ID ${id} was not found`);
    }
});

//Get track details from track ID
app.get('/api/tracks/:track_id', (req, res) => {
    const id = req.params.track_id;
    const track = trackDataFinal.find(p => p.track_id === id);
    if(track) {
        res.send(track);
    } else {
        res.status(404).send(`Track with ID ${id} was not found`);
    }
});

//Get track ID from album name
app.get('/api/tracks/album/:album_title', (req, res) => {
    const title = String.prototype.toLowerCase.call(req.params.album_title);
    let max = 0;
    let trackArray = [];

    trackDataFinal.forEach(track => {
        if((String.prototype.toLowerCase.call(track.album_title)).includes(title)){
            if(max < 8) {
                trackArray.push(track.track_id);
                max++;
            } 
        }
    })
    
    if(trackArray != []) {
        res.send(trackArray);
    } else {
        res.status(404).send(`Track from album: ${id} was not found`);
    }
});

//Get track ID from track title
app.get('/api/tracks/track/:track_title', (req, res) => {
    const title = String.prototype.toLowerCase.call(req.params.track_title);
    let max = 0;
    let trackArray = [];

    trackDataFinal.forEach(track => {
        if((String.prototype.toLowerCase.call(track.track_title)).includes(title)){
            if(max < 8) {
                trackArray.push(track.track_id);
                max++;
            } 
        }
    })
    
    if(trackArray != []) {
        res.send(trackArray);
    } else {
        res.status(404).send(`Track with name: ${id} was not found`);
    }
});

//Get artist ID from artist name
app.get('/api/artists/artist/:artist_name', (req, res) => {
    const name = String.prototype.toLowerCase.call(req.params.artist_name);
    let nameArray = [];

    artistDataFinal.forEach(artist => {
        if((String.prototype.toLowerCase.call(artist.artist_name)).includes(name)){
            nameArray.push(artist.artist_id);
        }
    })
    
    if(nameArray != []) {
        res.send(nameArray);
    } else {
        res.status(404).send(`Artist with name: ${id} was not found`);
    }
});

//Create new Playlist
router.put('/:name', (req, res) => {
    const newPlaylist = String.prototype.toLowerCase.call(req.params.name);
    console.log("Playlist:", newPlaylist);

    let identical = false;
    for(let i = 0; i < playlists.length; i++) {
        //Check if playlist exists
        if(String.prototype.toLowerCase.call(playlists[i].playlistname) === newPlaylist) {
            identical = true;
        }
    } 

    if(identical == false) {
        console.log('Creating new playlist');
        let sql = 'CREATE TABLE ' + newPlaylist + '(track_id VARCHAR(100) NOT NULL , id int AUTO_INCREMENT NOT NULL, PRIMARY KEY(id))';
        db.query(sql, err => {
            if (err) throw err;
            playlists.push(newPlaylist);
            addPlaylist(req.params.name);
            res.send(newPlaylist + ' table created')
        })
    } else if(identical == true) {
        console.log('Playlist already exists');
        res.sendStatus(400);
    }
});

//Add tracks to playlist
router.post('/:name', (req, res) => {
    const newtracks = req.body;
    console.log("Tracks: ", newtracks);

    let sqlDelete = 'TRUNCATE TABLE ' + req.params.name;
    db.query(sqlDelete, err => {
        if (err) throw err;
    })

    //console.log(newtracks.track_id[0]);
    newtracks.track_id.forEach(t => {
        let sql = `
            INSERT INTO ` + req.params.name + `(
                track_id
            )
            VALUES(
                '${t}'
            )`;
        db.query(sql, err => {
            if (err) throw err;
                
        })
    }) 
    
    res.send('Tracks added')
})

//Get ID's of all tracks in playlist
router.get('/tracks/:name', (req, res) => {
    let sql = 'SELECT * FROM ' + req.params.name;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

//Deletes list with a given name
router.delete('/:name', (req, res) => {
    const newPlaylist = String.prototype.toLowerCase.call(req.params.name);
    console.log("Playlist:", newPlaylist);

    let identical = false;
    for(let i = 0; i < playlists.length; i++) {
        //Check if playlist exists
        if(String.prototype.toLowerCase.call(playlists[i].playlistname) === newPlaylist) {
            identical = true;
            playlists.splice((i-1), (i+1));
        }
    } 

    if(identical == false) {
        console.log('Playlist not found');
        res.sendStatus(404);
    } else if(identical == true) {
        let sql = 'DROP TABLE ' + req.params.name;
        let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send("Deleted playlist " + req.params.name);
    })
    }
})



//Add playlist name to table
function addPlaylist(newList) {
    let sql = `
    INSERT INTO playlistnames(
        playlistname
    )
    VALUES(
        '${newList}'
    )`;
    db.query(sql, err => {
        if (err) throw err;
    })
}

//Install the router at /api/parts
app.use('/api/playlist', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
}); 