const apikey = "dac5e8403b2593cc044d0211121e0f7b";



let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

let timer;

document.getElementById("pesquisa").addEventListener("input", (e) => {
    let valor = e.target.value;

    clearTimeout(timer);

    if (valor.length > 2) {
        timer = setTimeout(() => buscarFilme(valor), 600);
    }
});

function buscarFilme(texto) {

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${texto}&language=pt-BR`)
    .then(r => r.json())
    .then(d => {
        mostrarFilmes(d.results);

        document.getElementById("pesquisa").value = "";
        document.getElementById("pesquisa").focus();
    });
}

function carregarPopulares() {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apikey}&language=pt-BR`)
    .then(r => r.json())
    .then(d => {
        criarCarrossel(d.results);
        mostrarFilmes(d.results);
    });
}

window.onload = carregarPopulares;

/* CARROSSEL */
function scrollCarrossel(dir){
    const c = document.getElementById("carrossel");
    c.scrollBy({left: dir * 300, behavior:"smooth"});
}

function criarCarrossel(lista){
    const c = document.getElementById("carrossel");
    c.innerHTML = "";

    lista.forEach(f=>{
        if(!f.poster_path) return;

        c.innerHTML += `
        <img src="https://image.tmdb.org/t/p/w500${f.poster_path}" onclick="abrirPagina(${f.id})">
        `;
    });
}

window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        nav.style.background = "rgba(0,0,0,0.9)";
    } else {
        nav.style.background = "rgba(0,0,0,0.6)";
    }
});

function mostrarFilmes(lista){
    const res = document.getElementById("resultado");
    res.innerHTML = "";

    if(!lista || lista.length === 0){
        res.innerHTML = `<p class="sem-resultado">Nenhum resultado encontrado 😢</p>`;
        return;
    }

    lista.forEach(f=>{
        if(!f.poster_path) return;

        let ativo = favoritos.includes(f.id);

        res.innerHTML += `
        <div class="filme">
            <img src="https://image.tmdb.org/t/p/w500${f.poster_path}" onclick="abrirPagina(${f.id})">

            <div class="favorito ${ativo ? 'ativo' : ''}" onclick="event.stopPropagation(); toggleFavorito(${f.id}, this)">
                <i class="${ativo ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </div>

            <p>⭐ ${f.vote_average}</p>
        </div>
        `;
    });
}

function toggleFavorito(id, el){
    let icon = el.querySelector("i");

    el.classList.add("ativo");

    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        icon.classList.replace("fa-solid", "fa-regular");
        el.classList.remove("ativo");
    } else {
        favoritos.push(id);
        icon.classList.replace("fa-regular", "fa-solid");
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function filtrar(tipo){
    fetch(`https://api.themoviedb.org/3/${tipo}/popular?api_key=${apikey}&language=pt-BR`)
    .then(r=>r.json())
    .then(d=>mostrarFilmes(d.results));
}

function mostrarFavoritos(){
    let res = document.getElementById("resultado");
    res.innerHTML = "";

    favoritos.forEach(id=>{
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&language=pt-BR`)
        .then(r=>r.json())
        .then(f=>{
            res.innerHTML += `
            <div class="filme">
                <img src="https://image.tmdb.org/t/p/w500${f.poster_path}" onclick="abrirPagina(${f.id})">
            </div>
            `;
        });
    });
}

function voltarInicio(){
    location.reload();
}

function abrirPagina(id){
    window.location.href = `movie.html?id=${id}`;
}