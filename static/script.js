document.getElementById('searchTrack').addEventListener('click', getByTrackName);
document.getElementById('searchArtist').addEventListener('click', getByArtistName);
document.getElementById('searchAlbum').addEventListener('click', getByAlbumName);

//getTracks();

/*function getTracks() {
    let initialPlaylist = 'test2';
    fetch(`/api/playlist/tracks/${initialPlaylist}`)
    .then(res => res.json() 
    .then(data => {
        const t = document.getElementById('playlistTracks');
        data.slice().reverse().forEach(e => {
            let count = 0;
            let trackid = e.track_id;
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
    })
    )
} */


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