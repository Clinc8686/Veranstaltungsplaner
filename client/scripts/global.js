// Print error message
export function printError () {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error';
  const errorSpan = document.createElement('span');
  errorSpan.className = 'closebtn';
  errorSpan.innerHTML = '&times';
  errorDiv.appendChild(errorSpan);
  const errorText = document.createTextNode('Da hat etwas nicht geklappt!');
  errorDiv.appendChild(errorText);

  const header = document.getElementsByTagName('header')[0];
  document.body.insertBefore(errorDiv, header);

  errorSpan.addEventListener('click', (e) => {
    const error = document.getElementById('error');
    error.remove();
  });
}
