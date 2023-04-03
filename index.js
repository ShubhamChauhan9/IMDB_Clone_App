const movieSearchBox = document.getElementById('input-search');
// input element
const searchList = document.getElementById('searchList');
// searchList div element
const searchBtn = document.getElementById('search-icon');
// searc-image icon div 

const favList = document.getElementById("fav");

const resultList = document.getElementById('searchResults');

let favmovies = [];

function searchMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

const localStorageName = "favMovies";

async function loadMovies(searchTerm) {
    await fetch(`https://omdbapi.com/?s=${searchTerm}&page=1&apikey=9beb446c`)
        .then((response) => response.json())
        .then((data) => {
            if (data.Response == "True") displayMovieList(data.Search);
        });
}

function resetBar() {
    movieSearchBox.value = "";
    movieSearchBox.placeholder = "Search IMDB"
}

function navigateToHome() {
    searchList.classList.add("hide-search-list")
    favList.classList.add("hide-search-list")
    resultList.classList.add("hide-search-list")
}

function removeMovie(i) {
    let arr = getListFromtLocalStorage();
    arr.splice(i, 1);
    localStorage.setItem(localStorageName, JSON.stringify(arr));
    if (arr.length > 0) {
        showFavList()
    } else {
        favList.innerHTML = "";
    }
}

function showFavList() {
    let arr = getListFromtLocalStorage();
    favList.innerHTML = "";
    if (arr == null || arr.length == 0) {
        window.alert("You've not added any movie into the list yet.");
        return;
    }

    for (var i = 0; i < arr.length; i++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = i;
        movieListItem.classList.add('fav-item');
        // console.log(arr[i]);
        movieListItem.innerHTML = `
        <div id = "movie-image" >
        <img src = "${(arr[i].Poster != "N/A") ? arr[i].Poster : "notfound.png"}" alt = "movie poster" class="rounded shadow-2xl">
        </div>
        <div id = "movie-info">
            <h2 class = "movie-title">${arr[i].Title}</h2>
        <p>Year: ${arr[i].Year} &nbsp;<span class=" bg-yellow-500 p-1 rounded">Rating: ${arr[i].Rated}</span> &nbsp;Released: ${arr[i].Released}</p>
        <p class="rounded shadow-md bg-zinc-700 p-1.5 w-fit"><span>Genere:</span> ${arr[i].Genre}</p>
        <p><span>Writer:</span> ${arr[i].Writer}</p>
        <p><span>Actors:</span> ${arr[i].Actors}</p>
        <p><span>Plot:</span> ${arr[i].Plot}</p> 
        <p><span>IMdb rating:</span> ${arr[i].imdbRating}</p>
        <p class="italic mv-lang"><span>Language: </span>${arr[i].Language}</p>
        <p><span><i class="fa-solid fa-award"></i></span>&nbsp;&nbsp;  ${arr[i].Awards}</p>
        <p class="shadow-2xl-p-2"><i onclick="removeMovie(${i})" class="fa-solid fa-trash text-xl"></i></p>
        </div>
        `;

        favList.appendChild(movieListItem);
    }
}

function showFav() {
    navigateToHome();
    favList.classList.remove("hide-search-list");
    showFavList();
}

function displayMovieDetails(details) {
    // console.log(details);
    let list = getListFromtLocalStorage();
    favList.classList.add('hide-search-list');
    resultList.classList.remove('hide-search-list');
    resultList.dataset.data = JSON.stringify(details);
    resultList.innerHTML = `
    <div id = "movie-image">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "notfound.png"}" alt = "movie poster" class="rounded shadow-2xl">
    </div>
    <div id = "movie-info" >
        <h1 class = "movie-title">${details.Title}</h1>
	  <p>Year: ${details.Year} &nbsp;<span class=" bg-yellow-500 p-1 rounded">Rating: ${details.Rated}</span> &nbsp;Released: ${details.Released}</p>
	  <p class="rounded shadow-md bg-zinc-700 p-1.5 w-fit"><span>Genere:</span> ${details.Genre}</p>
	  <p><span>Writer:</span> ${details.Writer}</p>
	  <p><span>Actors:</span> ${details.Actors}</p>
      <p><span>Plot:</span> ${details.Plot}</p>
      <p><span>Ratings:</span> ${details.imdbRating}</p>
	  <p class="italic mv-lang"><span>Language: </span>${details.Language}</p>
	  <p><span><i class="fa-solid fa-award"></i></span>&nbsp;&nbsp;  ${details.Awards}</p>
      <p><i onclick="fav(this)" class="heart ${list.find(item => item.imdbID === details.imdbID) ? "seleted-heart" : ""} fa-solid fa-heart text-2xl"></i></p>
    </div>
    `;
}

 function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', () => {
            fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9beb446c`)
                .then((response) => response.json())
                .then((data) => {
                    displayMovieDetails(data);
                });
        });
    });
}

function info(data) {
    resetBar();
    loadMovieDetails();
    searchList.classList.add('hide-search-list');
}

function makeFavList(params) {

    params = JSON.parse(params);
    if (localStorage.length == 0) {
        favmovies = [];
        favmovies.push(params);
        localStorage.setItem(localStorageName, JSON.stringify(favmovies));
    } else {
        favmovies = JSON.parse(localStorage.getItem(localStorageName));
        favmovies.push(params);
        localStorage.setItem(localStorageName, JSON.stringify(favmovies));
    }

}

function fav(data) {
    favAddedNoti();
    makeFavList(data.parentNode.parentNode.parentNode.dataset.data);
}

function fav1(data) {
    favAddedNoti();
    makeFavList(data.parentNode.dataset.data);
}

function favAddedNoti() {
    alert("added to My Favourites");
}


function getListFromtLocalStorage() {
    let favMovies = JSON.parse(localStorage.getItem(localStorageName)) || [];
    return favMovies;
}

async function displayMovieList(movies) {
    searchList.innerHTML = "";
    searchList.classList.remove('hide-search-list');

    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        // setting movie id in  data-id
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        // console.log(movieListItem);
        // api using id is being fethched here
       await fetch(`https://www.omdbapi.com/?i=${movies[idx].imdbID}&apikey=9beb446c`)
            .then((response) => response.json())
            .then((data) => {
                if (movies[idx].Poster != "N/A")
                    moviePoster = movies[idx].Poster;
                else
                    moviePoster = "notfound.png";
                // console.log(data);
                movieListItem.dataset.data = JSON.stringify(data);


                movieListItem.innerHTML = `
                    <div class = "search-item-thumbnail" onclick="info(this)">
                        <img class="movie-thumbnail" src = "${moviePoster}">
                    </div>
                    <div class = "search-item-info" onclick="info(this)">
                        <h3>${movies[idx].Title}</h3>
                        <p>${movies[idx].Year}</p>
                        <p>${data.Actors}</p>
                        <p>IMdb&nbsp;${data.imdbRating}</p>
                    </div>
                    <p class="heart" onclick='fav1(this)'><i class="fa-solid fa-heart text-2xl"></i></p>
                `;
            });
        searchList.appendChild(movieListItem);
    }
}
