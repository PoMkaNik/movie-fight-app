const API_URL = 'http://www.omdbapi.com/';
const API_KEY = '7d57367f';
const DELAY_SEC = 1;

createAutoComplete({
  root: document.querySelector('.autocomplete'),
  renderOption: (movie) => {
    // check if there is no img src for poster
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },
  onOptionSelect: (movie) => {
    onMovieSelect(movie);
  },
  inputValue: (movie) => {
    return movie.Title;
  },
  fetchData: async (query) => {
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
  },
});

const onMovieSelect = async (movie) => {
  // request additional movie data based on imdb id
  const response = await axios.get(API_URL, {
    params: {
      apikey: API_KEY,
      i: movie.imdbID,
    },
  });
  // render movie details
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" alt="${movieDetail.Title}" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
