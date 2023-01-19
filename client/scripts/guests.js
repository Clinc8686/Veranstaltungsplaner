import { printError } from './global';
import { createInput, createOptions, deleteContent } from './events';
import { displayTableConfiguration } from './tables';

export function createInputRow (id, type, placeholder, name, labelText) {
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
  const inputFirstName = createInputRow('inputName', 'text', 'Max Mustermann', 'inputName', 'Name:');
  const selectInvitation = createSelectRow('selectInvitation', 'Einladungsstatus:');
  const optUnknown = createOptions('unbekannt');
  const optInvited = createOptions('eingeladen');
  const optAccepted = createOptions('zugesagt');
  const optCanceled = createOptions('abgesagt');
  const childCheckbox = createInputRow('checkboxChild', 'checkbox', 'Nein', 'checkboxChild', 'Ist die Person ein Kind?:');
  const addButton = document.createElement('button');
  selectInvitation.lastChild.appendChild(optUnknown);
  selectInvitation.lastChild.appendChild(optInvited);
  selectInvitation.lastChild.appendChild(optAccepted);
  selectInvitation.lastChild.appendChild(optCanceled);
  h2.innerHTML = 'Gästeliste:';
  div.className = 'box';
  h3.innerHTML = 'Neue Gäste eintragen';
  section.id = 'insertGuestsSection';
  addButton.type = 'button';
  addButton.className = 'site-button';
  addButton.id = 'insertGuestsButton';
  addButton.innerHTML = 'Hinzufügen';
  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(div);
  div.appendChild(h3);
  div.appendChild(form);
  form.appendChild(inputFirstName);
  form.appendChild(selectInvitation);
  form.appendChild(childCheckbox);
  div.appendChild(addButton);
  buttonListener();
  selectGuests();
}

function displayGuests (guests) {
  console.log(guests);
}

function selectGuests () {
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
        displayGuests(response);
      } else {
        printError();
      }
    } catch (error) {
      console.log('response error: ' + error);
    }
  };
  handleSelect();
}

// Button listener for insert guests
function buttonListener () {
  document.getElementById('insertGuestsButton').addEventListener('click', (e) => {
    // prevent forwarding
    e.preventDefault();

    const name = document.getElementById('inputName').value;
    const section = document.getElementById('insertGuestsSection');
    let children = 0;
    if (document.getElementById('checkboxChild').checked) {
      children = 1;
    }

    const invitationStatus = document.getElementById('selectInvitation').value;
    const data = { name, children, invitationStatus };

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
          deleteContent(section);
          displayTableConfiguration();
          console.log('funktioniert');
        } else {
          printError();
          console.log('response error: \n' + error);
        }
      }
    };
    handleInsert();
  });
}

/* Print all guests
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
*/
