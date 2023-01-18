import { printError } from './global';
import { createInput, createOptions } from './events';

function createInputRow (id, type, placeholder, name, labelText) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  const input = createInput(id, type, placeholder, name);
  label.id = name.concat('Label');
  label.innerHTML = labelText;
  div.appendChild(label);
  div.appendChild(input);
  return div;
}

function createSelectRow (id, labelText) {
  const div = document.createElement('div');
  const label = document.createElement('label');
  const select = document.createElement('select');
  label.id = id.concat('Label');
  label.innerHTML = labelText;
  select.id = id;
  select.name = id;
  div.appendChild(label);
  div.appendChild(select);
  return div;
}

export function insertNewGuests () {
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const form = document.createElement('form');
  const inputFirstName1 = createInputRow('inputFirstName1', 'text', 'Max', 'inputFirstName1', 'Vorname:');
  const inputName1 = createInputRow('inputName1', 'text', 'Mustermann', 'inputName1', 'Nachname:');
  const selectInvitation1 = createSelectRow('selectInvitation1', 'Einladungsstatus:');
  const optUnknown = createOptions('unbekannt');
  const optInvited = createOptions('eingeladen');
  const optAccepted = createOptions('zugesagt');
  const optCanceled = createOptions('abgesagt');
  selectInvitation1.lastChild.appendChild(optUnknown);
  selectInvitation1.lastChild.appendChild(optInvited);
  selectInvitation1.lastChild.appendChild(optAccepted);
  selectInvitation1.lastChild.appendChild(optCanceled);
  h2.innerHTML = 'Gästeliste:';
  div.className = 'box';
  h3.innerHTML = 'Neue Gäste eintragen';
  section.id = 'insertGuestsSection';
  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(div);
  div.appendChild(h3);
  div.appendChild(form);
  form.appendChild(inputFirstName1);
  form.appendChild(inputName1);
  form.appendChild(selectInvitation1);
}

// Button listener for select guests
document.getElementById('selectAll').addEventListener('click', (e) => {
  // prevent forwarding
  e.preventDefault();
  console.log(document.getElementById('insertEvent'));
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
