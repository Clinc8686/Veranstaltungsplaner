// Print error message
function printError (errorMessage) {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error';
  const errorSpan = document.createElement('span');
  errorSpan.className = 'closebtn';
  errorSpan.innerHTML = '&times';

  errorDiv.appendChild(errorSpan);
  errorDiv.appendChild(document.createTextNode('Da hat etwas nicht geklappt!'));
  errorDiv.appendChild(document.createElement(('br')));
  if (errorMessage) {
    errorDiv.appendChild(document.createTextNode(errorMessage));
  }

  const header = document.getElementsByTagName('header')[0];
  document.body.insertBefore(errorDiv, header);

  errorSpan.addEventListener('click', (e) => {
    const error = document.getElementById('error');
    error.remove();
  });
}

// EventID which will be created and/or edited
let currentEventID;

export { printError, currentEventID };
