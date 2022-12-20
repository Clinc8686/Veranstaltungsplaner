// Button listener for select guests
document.getElementById('selectAll').addEventListener('click', (e) => {
  // prevent forwarding
  e.preventDefault();
  const handleSelect = async () => {
    const sent = await fetch('/guests/select/2', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.persons) {
        printTable(response);
      } else {
        printError();
      }
    } catch (error) {
      console.log('response error: ' + error);
    }
  };

  handleSelect();
});

// Button listener for insert guests
document.getElementById('insertGuest').addEventListener('click', (e) => {
  // prevent forwarding
  e.preventDefault();

  const name = document.getElementById('name').value;
  let children = 0;
  if (document.getElementById('child').checked) {
    children = 1;
  }

  console.log(children);
  const invitationstatus = document.getElementById('invitationstatus').value;
  const data = { name, children, invitationstatus };

  const handleInsert = async () => {
    const sent = await fetch('/guests/insert/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    try {
      const response = await sent.json();
      if (response.success === false) {
        printError();
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        fireSelect();
      } else {
        printError();
        console.log('response error: \n' + error);
      }
    }
  };

  handleInsert();
});

// Print all guests
function printTable (response) {
  const oldTableBody = document.getElementById('tableBody');

  // remove all old printed guests
  while (oldTableBody.rows.length > 0) {
    oldTableBody.deleteRow(0);
  }

  // print actual new guests
  for (const key in response.persons) {
    const newRow = oldTableBody.insertRow();
    const person = response.persons[key];
    for (const personRow in person) {
      const newCell = newRow.insertCell();
      const newText = document.createTextNode(person[personRow]);
      newCell.appendChild(newText);
    }
  }
}

// Print error message
function printError () {
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

// Simulates Click on selectAll Button
function fireSelect () {
  document.getElementById('selectAll').click();
}
