const apikey = "dac5e8403b2593cc044d0211121e0f7b";


const id = new URLSearchParams(window.location.search).get("id");

fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&language=pt-BR`)
.then(r => r.json())
.then(f => {
    document.getElementById("movie").innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${f.poster_path}">
        <div>
            <h2>${f.title}</h2>
            <p>${f.overview}</p>
        </div>
    `;
});

fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apikey}`)
.then(r => r.json())
.then(d => {
    let t = d.results.find(v => v.type === "Trailer");

    if(t){
        document.getElementById("trailer").innerHTML = `
        <iframe src="https://www.youtube.com/embed/${t.key}" allowfullscreen></iframe>
        `;
    }
});

function voltar(){
    window.location.href = "index.html";
}