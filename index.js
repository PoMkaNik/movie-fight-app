const API_URL = 'http://www.omdbapi.com/';
const API_KEY = '7d57367f';
const DELAY_SEC = 1;

const fetchData = async (query) => {
  const response = await axios.get(API_URL, {
    params: {
      apikey: API_KEY,
      s: query,
      // i: 'tt0848228',
    },
  });

  // if error -> we need to return empty array
  // because below we iterating it
  if (response.data.Error) return [];

  return response.data.Search;
};

const input = document.querySelector('input');

const onInput = debounce(async (e) => {
  // get query from input field on change
  const searchQuery = e.target.value;
  // get movies from API
  const movies = await fetchData(searchQuery);
  // render movies
  for (let movie of movies) {
    const div = document.createElement('div');

    div.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title}</h1>
    `;

    document.querySelector('#target').appendChild(div);
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
