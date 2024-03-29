document.getElementById('searchTrack').addEventListener('click', getByTrackName);
document.getElementById('searchArtist').addEventListener('click', getByArtistName);
document.getElementById('searchAlbum').addEventListener('click', getByAlbumName);
document.getElementById('addPlaylist').addEventListener('click', addNewPlaylist);
document.getElementById('refreshPlaylists').addEventListener('click', showAllPlaylists);
document.getElementById('addToPlaylist').addEventListener('click', updatePlaylist);
document.getElementById('deletePlaylist').addEventListener('click', deletePlaylist);

let chosenPlaylist = '';
let chosenTracks = [];

showAllPlaylists();

function showAllPlaylists() {
    const t = document.getElementById('allPlaylists');
    t.replaceChildren('');

    fetch('/api/playlist')
    .then(res => res.json()
    .then(data => {
        data.forEach(e => {
            const row = document.createElement('tr');
            const item = document.createElement('th');
            item.classList.add("playlistCenter");
            item.addEventListener("click", function(){
                chosenPlaylist = (item.innerText.substring(0, item.innerText.indexOf(' •')));
                getPlaylistData(chosenPlaylist);
            });
            item.appendChild(document.createTextNode(`${e.name} • ${e.counter} songs, ${e.timer} duration`));
            row.appendChild(item);
            t.appendChild(row);
        });
    })
    )
}

function updatePlaylist() {
    fetch(`/api/playlist/${chosenPlaylist}`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(chosenTracks)
    })
    .then(res => {
        if(res.ok)
        res.json()
        .then(data => console.log(data))
        .catch(console.log('Failed to get json object'))
    })
    .catch()

    const t = document.getElementById('addTracks');
    t.replaceChildren('');
}

function deletePlaylist() {
    fetch(`/api/playlist/${chosenPlaylist}`, {
        method: 'DELETE'
    })
    .then(res => {
        res.json()
        .then(data => console.log(data))
        .catch(console.log('Failed to get json object'))
    })
    .catch()
}


function addNewPlaylist() {
    const newName = document.getElementById('newplaylist').value
    console.log(newName);
    fetch(`/api/playlist/${newName}`, {
        method: 'PUT'
    })
    .then(res => {
        res.json()
        .then(data => console.log(data))
        .catch(console.log('Failed to get json object'))
    })
    .catch()
}


function getByTrackName() {
    const trackName = document.getElementById('track').value
    const t = document.getElementById('playlistTracks');

    if(trackName == '') {
        alert("Name must be entered");
        return false;
    } else {
        fetch(`/api/tracks/track/${trackName}`)
        .then(res => res.json()
        .then(data => {
            populateTable(data);
        })
        )
    }
}

function getByArtistName() {
    const artistName = document.getElementById('artist').value
    const t = document.getElementById('playlistTracks');

    if(artistName == '') {
        alert("Name must be entered");
        return false;
    } else {
        fetch(`/api/artists/artist/${artistName}`)
        .then(res => res.json()
        .then(data => {
            populateTableArtist(data);
        })
        )
    }
}

function getByAlbumName() {
    const albumName = document.getElementById('album').value
    const t = document.getElementById('playlistTracks');

    if(albumName == '') {
        alert("Name must be entered");
        return false;
    } else {
        fetch(`/api/tracks/album/${albumName}`)
        .then(res => res.json()
        .then(data => {
            populateTable(data);
        })
        )
    }
}

function getPlaylistData(playlist) {
    fetch(`/api/playlist/tracks/${playlist}`)
    .then(res => res.json()
    .then(data => {
        let temp = [];
        data.forEach(e => {
            temp.push(e.track_id)
        })
        populateTable(temp);
    })
    )
}

function addToPlaylist(track) {
    let currentPlaylist = '';
    const t = document.getElementById('addTracks');
    const row = document.createElement('tr');
    const item = document.createElement('th');

    if(currentPlaylist != chosenPlaylist) {
        chosenTracks = [];
        currentPlaylist = chosenPlaylist;
    }

    item.appendChild(document.createTextNode(`Track_id is: ${track}`));
    row.appendChild(item);
    t.appendChild(row);

    chosenTracks.push(track);
    
}


function populateTable(data) {
    const t = document.getElementById('playlistTracks');

    data.forEach(e => {
                let count = 0;
                let trackid = e;
                fetch(`/api/tracks/${trackid}`)
                .then(res => res.json()
                .then(data => {
                    const row = t.insertRow(count);
                    row.classList.add("data");
                    var cell1 = row.insertCell(0);
                    
                    cell1.classList.add("heading_num");
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);

                    cell6.addEventListener("click", function(){
                        addToPlaylist(cell1.innerText);
                    });

                    cell1.innerText = data.track_id;
                    cell2.innerText = '';
                    cell3.innerText = data.track_title;
                    cell4.innerText = data.album_title;
                    cell5.innerText = data.track_duration;
                    cell6.innerText = '+';
                })
                )             
                count += 1;
            });
} 

function populateTableArtist(data) {
    const t = document.getElementById('playlistTracks');
    data.forEach(e => {
                let count = 0;
                let artistid = e;
                fetch(`/api/artists/${artistid}`)
                .then(res => res.json()
                .then(data => {
                    const row = t.insertRow(count);
                    row.classList.add("data");
                    var cell1 = row.insertCell(0);
                    cell1.classList.add("heading_num");
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    cell1.innerText = data.artist_id;
                    cell2.innerText = '';
                    cell3.innerText = data.artist_name;
                    cell4.innerText = data.artist_handle;
                    cell5.innerText = data.artist_favorites;
                    cell6.innerText = '+';
                })
                )             
                count += 1;
            });
} 