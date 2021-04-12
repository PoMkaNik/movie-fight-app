const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input type="text" class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
      </div>
    </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const onInput = debounce(async (e) => {
    // get query from input field on change
    const searchQuery = e.target.value;
    // get items from API
    const items = await fetchData(searchQuery);
    // if no results
    if (!items.length) {
      // need to 'close' dropdown if we clear the input after successful search
      dropdown.classList.remove('is-active');
      return;
    }
    // clear resultsWrapper
    resultsWrapper.innerHTML = '';
    // open dropdown
    dropdown.classList.add('is-active');
    // render items
    for (let item of items) {
      // Bulma is required <a> as item dropdown item wrapper
      const option = document.createElement('a');
      // add required by Bulma css class
      option.classList.add('dropdown-item');
      // create content of new element
      option.innerHTML = renderOption(item);
      // listen click on this item
      option.addEventListener('click', () => {
        // close dropdown
        dropdown.classList.remove('is-active');
        // update input field value
        // we can reference the  item in this loop as closure
        input.value = inputValue(item);
        // get more data for clicked item
        onOptionSelect(item);
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
};
