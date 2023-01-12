import { printError } from './global';
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
        if (response.errorMessage === 'notNull') {
          printError('Es müssen alle Felder ausgefüllt werden!');
        } else {
          printError();
        }
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

// Simulates Click on selectAll Button
function fireSelect () {
  document.getElementById('selectAll').click();
}
