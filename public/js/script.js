const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=9a139466`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < 3; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('container');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        movieListItem.innerHTML = `
        <div class="card mb-3 mx-auto" style="width: 18rem;">
        <img src="${moviePoster}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${movies[idx].Title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${movies[idx].Year}</h6>
        </div>
      </div>
        `;
        searchList.appendChild(movieListItem);
    }
}



window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});