getTracks();

function getTracks() {
    let initialPlaylist = 'initialplaylist';
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
}



var getByTrackName = document.getElementById("track").value;
console.log(getByTrackName);