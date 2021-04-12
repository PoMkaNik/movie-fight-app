const API_URL = 'http://www.omdbapi.com/';
const API_KEY = '7d57367f';
const DELAY_SEC = 1;

const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input type="text" name="search-1" id="search-1" class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const fetchData = async (query) => {
  const response = await axios.get(API_URL, {
    params: {
      apikey: API_KEY,
      s: query,
    },
  });

  // if error -> we need to return empty array
  // because below we iterating it
  if (response.data.Error) return [];

  return response.data.Search;
};

const onMovieSelect = async (movie) => {
  // request additional movie data based on imdb id
  const response = await axios.get(API_URL, {
    params: {
      apikey: API_KEY,
      i: movie.imdbID,
    },
  });
  //
  console.log(response);
};

const onInput = debounce(async (e) => {
  // get query from input field on change
  const searchQuery = e.target.value;
  // get movies from API
  const movies = await fetchData(searchQuery);
  // if no results
  if (!movies.length) {
    // need to 'close' dropdown if we clear the input after successful search
    dropdown.classList.remove('is-active');
    return;
  }
  // clear resultsWrapper
  resultsWrapper.innerHTML = '';
  // open dropdown
  dropdown.classList.add('is-active');
  // render movies
  for (let movie of movies) {
    // Bulma is required <a> as item dropdown item wrapper
    const option = document.createElement('a');
    // check if there is no img src for poster
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    // add required by Bulma css class
    option.classList.add('dropdown-item');
    // create content of new element
    option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
    // listen click on this item
    option.addEventListener('click', () => {
      // update input field value
      // we can reference the movie item in this loop as closure
      input.value = movie.Title;
      // close dropdown
      dropdown.classList.remove('is-active');
      // get more data for clicked movie
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
}); // =>
// returns new function
// (...args) => {
// if timeout was already created -> clear it
// timeoutID && clearTimeout(timeoutID);
// and create new one timeout
// timeoutID = setTimeout(() => callback.apply(null, args), DELAY_SEC * 1000);
// };

input.addEventListener('input', onInput); // =>
// onInput receives EVENT param by default due to behavior of addEventListener
// and run following function every input performed by user
// (EVENT) => {
// timeoutID && clearTimeout(timeoutID);
// timeoutID = setTimeout(() => {
// (EVENT) => {
// const searchQuery = EVENT.target.value;
// fetchData(searchQuery)
// }
// , DELAY_SEC * 1000);
// };

document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) dropdown.classList.remove('is-active');
});
