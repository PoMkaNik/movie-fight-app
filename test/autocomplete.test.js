const DELAY_SEC = 1;

const waitFor = (selector) => {
  return new Promise((res, rej) => {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        clearTimeout(timeout);
        res();
      }
    }, 30);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      rej();
    }, 2000);
  });
};

beforeEach(() => {
  // clean root div
  document.querySelector('#target').innerHTML = '';
  // create new autocomplete widget before each test
  createAutoComplete({
    root: document.querySelector('#target'),
    fetchData() {
      return [
        { Title: 'Avengers' },
        { Title: 'Not Avengers' },
        { Title: 'Some Other Movie' },
      ];
    },
    renderOption(movie) {
      return movie.Title;
    },
  });
});

it('Dropdown starts closed', () => {
  const dropdown = document.querySelector('.dropdown');
  // check class 'is-active' not exists -> dropdown open
  expect(dropdown.className).not.to.include('is-active');
});

it('After searching dropdown opens up', async () => {
  // fake input
  const input = document.querySelector('input');
  input.value = 'avengers';
  input.dispatchEvent(new Event('input'));

  // wait till element appear
  await waitFor('.dropdown-item');

  // check class 'is-active' exists -> dropdown open
  const dropdown = document.querySelector('.dropdown');
  expect(dropdown.className).to.include('is-active');
});

it('After searching displays some results', async () => {
  // fake input
  const input = document.querySelector('input');
  input.value = 'avengers';
  input.dispatchEvent(new Event('input'));

  // wait till element appear
  await waitFor('.dropdown-item');

  // find all results
  const items = document.querySelectorAll('.dropdown-item');
  expect(items.length).to.equal(3);
});
