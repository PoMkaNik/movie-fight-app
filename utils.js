const debounce = (callback, delay = DELAY_SEC * 1000) => {
  let timeoutID;
  // return new function that
  // 1) have timeoutID in closure
  // 2) awaiting for args to be passed during invoking
  return (...args) => {
    // if timeout was already created -> clear it
    timeoutID && clearTimeout(timeoutID);
    // and create new one timeout
    // apply with args -> for run when timer ends
    timeoutID = setTimeout(() => callback.apply(null, args), delay);
  };
};
