const API_URL = 'http://www.omdbapi.com/';
const API_KEY = '7d57367f';
const DELAY_SEC = 1;

// common autocomplete options moved in separate object
const autoCompleteConfig = {
  renderOption: (movie) => {
    // check if there is no img src for poster
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
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
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  // request additional movie data based on imdb id
  const response = await axios.get(API_URL, {
    params: {
      apikey: API_KEY,
      i: movie.imdbID,
    },
  });
  // render movie details
  summaryElement.innerHTML = movieTemplate(response.data);
  // save movie for further comparison
  side === 'left' ? (leftMovie = response.data) : (rightMovie = response.data);
  // if both movies selected -> start comparison
  if (leftMovie && rightMovie) runComparison();
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification',
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification',
  );

  leftSideStats.forEach((leftStat, i) => {
    const rightStat = rightSideStats[i];
    if (parseInt(leftStat.dataset.value) > parseInt(rightStat.dataset.value)) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  // create data for easy comparison to insert it in data-value
  const awards = movieDetail.Awards.split(' ')
    // get only numbers from array
    .filter((item) => !isNaN(parseInt(item)))
    // sum numbers in array
    // (need to parseInt() because .filter do not change items in array)
    .reduce((sum, curValue) => (sum = sum + parseInt(curValue)), 0);

  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''),
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

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
    <article class="notification is-primary" data-value="${awards}">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary" data-value="${dollars}">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary" data-value="${metascore}">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary"  data-value="${imdbRating}">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary"  data-value="${imdbVotes}">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
