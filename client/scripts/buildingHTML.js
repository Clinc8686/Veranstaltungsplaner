require('./guests');
require('./events');

window.onload = function () {
  // Testing dynamic site load
  document.getElementById('newGuestsButton').onclick = function () {
    document.getElementById('home').style.display = 'none';
    document.getElementById('guests').style.display = 'block';
  };
  document.getElementById('homeButton').onclick = function () {
    document.getElementById('home').style.display = 'block';
    document.getElementById('guests').style.display = 'none';
  };
};
