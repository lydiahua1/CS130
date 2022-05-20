const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);
let play = false; 

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
    // console.log(`
    //     get tracks from spotify based on the search term
    //     "${term}" and load them into the #tracks section 
    //     of the DOM...`);
    const elem = document.querySelector("#tracks");
    elem.innerHTML = "";
    fetch(baseURL + "?type=track&q=" + term)
        .then((response) => response.json())
        .then((data) =>{
            console.log(data)
            if (data.length > 0) {
                const fivetracks = data.slice(0,5);
                fivetracks.map(element => {
                    elem.innerHTML += gettracksHTML(element) 
                })} else {
                    elem.innerHTML += `<p> no tracks found that match your search criteria</p>`;
                }
                
            }
        )
};

gettracksHTML = (data) => {
    console.log('Track data', data)
    if (!data.album.image_url) {
        data.image_url = 
            "https://www.pngkit.com/png/full/943-9439413_blue-butterfly-free-png-image-dark-blue-to.png";
    }
    if (!data.preview_url){
        return `<button class="track-item preview">
            <img src="${data.album.image_url}" alt="${data.album.name}">
            <i class="fas play-track fa-play" aria-hidden="true"></i>
            <div class="label">
                <h2>${data.album.name}</h2>
                <p>
                    ${data.artist.name} (no preview available)
                </p>
            </div>
            </button>`;
                }

   return `<button class="track-item preview" data-preview-track="${data.preview_url}" onclick="handleTrackClick(event);">
   <img src="${data.album.image_url}" alt="${data.album.name}">
   <i class="fas play-track fa-play" aria-hidden="true"></i>
   <div class="label">
       <h2>${data.album.name}</h2>
       <p>
           ${data.artist.name}
       </p>
   </div>
</button>`;
};

const getAlbums = (term) => {
    // console.log(`
    //     get albums from spotify based on the search term
    //     "${term}" and load them into the #albums section 
    //     of the DOM...`);
    const elem = document.querySelector("#albums");
    elem.innerHTML = "";

    fetch(baseURL + "?type=album&q=" + term)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                data.map(element => {
                    elem.innerHTML += getAlbumsHTML(element) 
                })} else {
                    elem.innerHTML += `<p> no albums found that match your search criteria</p>`;
                }
        });
    };

const getAlbumsHTML = (data) => {
    console.log("albums",data)
    if (!data.image_url) {
        data.image_url = 
        "https://www.pngkit.com/png/full/943-9439413_blue-butterfly-free-png-image-dark-blue-to.png";
}
    return `<section class="album-card" id="${data.id}">
            <div>
                <img src="${data.image_url}" alt="${data.image_url}">
                <h2>${data.name}</h2>
                <div class="footer">
                    <a href="${data.spotify_url}" target="_blank">
                        view on spotify
                    </a>
                </div>
            </div>
        </section>`;
        
};
        


const getArtist = (term) => {
    // console.log(`
    //     get artists from spotify based on the search term
    //     "${term}" and load the first artist into the #artist section 
    //     of the DOM...`);
    const elem = document.querySelector("#artist");
    elem.innerHTML = "";

    fetch(baseURL + "?type=artist&q=" + term)
        .then((response) => response.json())
        .then((data) => {
            if (data.length > 0) {
                const firstArtist = data[0];
                elem.innerHTML += getArtistHTML(firstArtist);
                console.log("artist", firstArtist);
            } else {
                elem.innerHTML += `<p> no artists found that match your search criteria</p>`;
            }
        });
};


const getArtistHTML = (data) => {
    if (!data.image_url) {
        data.image_url = 
            "https://www.pngkit.com/png/full/943-9439413_blue-butterfly-free-png-image-dark-blue-to.png";
    }
   return `<section class="artist-card" id="${data.id}">
            <div>
                <img alt="${data.name}" src="${data.image_url}">
                <h2>${data.name}</h2>
                <div class="footer">
                    <a href="${data.spotify_url}" target="_blank">
                        view on spotify
                    </a>
                </div>
            </div>
        </section>`;
};


const handleTrackClick = (ev) => {
    const footer = document.querySelector('footer'); 
    footer.style.visibility = "visible";
    const previewUrl = ev.currentTarget.getAttribute('data-preview-track');
    console.log(previewUrl);
    audioPlayer.setAudioFile(previewUrl);
    if(play == false) {
        audioPlayer.play();
        play = true;
    }
    else {
        audioPlayer.pause(); 
        play = false;
    }
}
document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    if (ev.keyCode === 13) {
        search(); 
        ev.preventDefault(); 
    }
};
