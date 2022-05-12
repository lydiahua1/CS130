const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

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

    fetch(baseURL + "?type=tracks&q=" + term)
        .then((response) => response.json())
        .then((data) =>{
            if (data.length > 0) {
                const fivetracks = data.slice(0,5);
                fivetracks.array.forEach(element => {
                    elem.innerHTML += gettracksHTML(element)
                });
                
            }
        })
};

gettracksHTML = (data) => {
    if (!data.image_url) {
        data.image_url = 
            "https://www.pngkit.com/png/full/943-9439413_blue-butterfly-free-png-image-dark-blue-to.png";
    }
   return `<button class="track-item preview" data-preview-track="https://p.scdn.co/mp3-preview/879c7106422b0b53852209da6a63210be7e09b01?cid=9697a3a271d24deea38f8b7fbfa0e13c" onclick="handleTrackClick(event);">
   <img src="https://i.scdn.co/image/1aacaefb0ef07755e5a155d96ee7f1073063e428">
   <i class="fas play-track fa-play" aria-hidden="true"></i>
   <div class="label">
       <h2>Black Swan</h2>
       <p>
           BTS
       </p>
   </div>
</button>`;
};
}

const getAlbums = (term) => {
    console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);
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
                console.log(firstArtist);
            } else {
                elem.innerHTML += `<p> no tracks found that match your search criteria</p>`;
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
                <img alt="Image of ${data.name}" src="${data.image_url}">
                <h2>${data.name}</h2>
                <div class="footer">
                    <a href="${data.spofity_url}" target="_blank">
                        view on spotify
                    </a>
                </div>
            </div>
        </section>`;
};


const handleTrackClick = (ev) => {
    const previewUrl = ev.currentTarget.getAttribute('data-preview-track');
    console.log(previewUrl);
}

document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};