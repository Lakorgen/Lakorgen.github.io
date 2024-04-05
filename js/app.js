const swiper = new Swiper('.swiper', {
    loop: true,
    effect: "fade",
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

const API_Popular_ongoing = 'https://shikimori.one/api/animes?limit=30&status=ongoing&order=popularity';
const API_Popular_ongoing_slider = 'https://shikimori.one/api/animes?limit=10&status=ongoing&order=popularity';
const API_URL_Search = 'https://shikimori.one/api/animes?limit=30&search=';
const API_URL_ANIME_ID = 'https://shikimori.one/api/animes/';
const api_filt = 'https://shikimori.one/api/animes?';
getAnime(API_Popular_ongoing);
getAnimeSlider(API_Popular_ongoing_slider);




async function getAnime(url){
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData);
    showAnime(respData);
}
async function getAnimeSlider(url){
    const resp = await fetch(url);
    const respData = await resp.json();
    console.log(respData);
    showAnimeSlider(respData);
}

function getClassByRate(vote){
    if(vote>=7.5){
        return 'green';
    }   else if(vote>6.5){
        return 'orange';
    } else{
        return 'red';
    }
}

function showAnimeSlider(data){
    const AnimesEl = document.querySelector(".swiper-wrapper");
    document.querySelector(".swiper-wrapper").innerHTML="";
    data.forEach((anime) => {
        const animeEl = document.createElement("div");
        animeEl.classList.add("swiper-slide");
        animeEl.innerHTML = 
        `<img src="https://shikimori.one/${anime.image.original}" alt="постер" class="movie__cover">`;
                animeEl.addEventListener('click', () => openModal(anime.id))
        AnimesEl.appendChild(animeEl);
    });
}

function showAnime(data){
    const AnimesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML="";

    data.forEach((anime) => {
        const animeEl = document.createElement("div");
        animeEl.classList.add("movie");
        animeEl.innerHTML = 
        `<div class="movie__cover-inner">
                    <img src="https://shikimori.one/${anime.image.original}" alt="постер" class="movie__cover">
                    <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${anime.russian}</div>
                    <div class="movie__category">Серий: ${anime.episodes_aired}/${anime.episodes != 0 ? anime.episodes : "?"}</div>
                    <div class="movie__average movie__average--${getClassByRate(anime.score)}">${anime.score}</div>
                </div>`;
                animeEl.addEventListener('click', () => openModal(anime.id))
        AnimesEl.appendChild(animeEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector(".header__search");
form.addEventListener("submit",(e) =>{
    e.preventDefault();

    const TotalURL = `${API_URL_Search}${search.value}&order=popularity`
    if(search.value){
        getAnime(TotalURL);
        search.value ="";
    }
})



const modalEL = document.querySelector('.modal');

async function openModal(id){
    console.log(id);
    const resp = await fetch(API_URL_ANIME_ID+id);
    const respData = await resp.json();
    console.log(respData);
    modalEL.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");

    modalEL.innerHTML = `
        <div class="modal__card">
          <img class="modal__movie-backdrop" src="https://shikimori.one/${respData.image.original}" alt="">
          <h2>
            <span class="modal__movie-title">${respData.russian}</span>
            <span class="modal__movie-release-year"> - ${respData.aired_on}</span>
          </h2>
          <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">Жанр -${respData.genres.map((el) => `<span> ${el.russian}</span>`)}</li>
            <li class="modal__movie-runtime">Количество серии - ${respData.episodes_aired}/${respData.episodes != 0 ? respData.episodes : "?"}</li>
            <li class="modal__movie-runtime">Длительность серии - ${respData.duration} минут</li>
            <li >Сайт: <a class="modal__movie-site" href="https://shikimori.one/${respData.url}">${respData.name}</a></li>
            <li class="modal__movie-overview">Описание - ${respData.description_html}</li>
          </ul>
          <button type="button" class="modal__button-close">Закрыть</button>
        </div>
      `
      const btnClose = document.querySelector('.modal__button-close');
      btnClose.addEventListener('click', ()=> closeModal());
}

function closeModal(){
    modalEL.classList.remove('modal--show');
    document.body.classList.remove('stop-scrolling');
}

window.addEventListener("click", (e)=>{
    if(e.target === modalEL){
        closeModal();
    }
})

window.addEventListener("keydown", (e) => {
    if(e.keyCode === 27){
        closeModal();
    }
})

