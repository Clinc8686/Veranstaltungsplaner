import { currentEvent, printError } from './global';
import { createInput, createOptions, deleteContent } from './events';
import { displaySeatinplan } from './tables';

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

function guestsForm (guest = { id: 'inputName', name: 'Max Mustermann' }) {
  const form = document.createElement('form');
  const inputFirstName = createInputRow(guest.id, 'text', guest.name, 'inputName', 'Name:');
  const selectInvitation = createSelectRow('selectInvitation', 'Einladungsstatus:');
  const optUnknown = createOptions('unbekannt');
  const optInvited = createOptions('eingeladen');
  const optAccepted = createOptions('zugesagt');
  const optCanceled = createOptions('abgesagt');
  const childCheckbox = createInputRow('checkboxChild', 'checkbox', 'Nein', 'checkboxChild', 'Ist die Person ein Kind?:');
  form.id = 'insertGuestsForm';
  selectInvitation.lastChild.appendChild(optUnknown);
  selectInvitation.lastChild.appendChild(optInvited);
  selectInvitation.lastChild.appendChild(optAccepted);
  selectInvitation.lastChild.appendChild(optCanceled);
  form.appendChild(inputFirstName);
  form.appendChild(selectInvitation);
  form.appendChild(childCheckbox);
  return form;
}

export function insertNewGuests () {
  console.log('Gäste der Veranstaltung '.concat(currentEvent.id).concat(' sollen geändert werden.'));
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const addButton = document.createElement('button');
  const divSelect = document.createElement('div');
  const form = guestsForm();
  divSelect.id = 'selectGuestsDiv';
  h2.innerHTML = 'Gästeliste:';
  div.id = 'insertGuestsDiv';
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
  div.appendChild(addButton);
  div.appendChild(divSelect);
  buttonListenerInsert();
  selectGuests();
  nextButton();
}

function nextButton () {
  const section = document.getElementById('insertGuestsSection');
  const buttonDiv = document.createElement('div');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'site-button';
  button.innerHTML = 'weiter';
  buttonDiv.id = 'divToTableConfigurationsButton';
  section.appendChild(buttonDiv);
  buttonDiv.appendChild(button);
  button.addEventListener('click', function () {
    deleteContent(section);
    displaySeatinplan();
  });
}

function displayGuests (guests) {
  let currPage = 0;
  const div = document.getElementById('selectGuestsDiv');
  const divSelectedPages = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.innerHTML = 'Eingetragene Gäste';
  divSelectedPages.id = 'selectedGuestsPages';
  const displayPage = () => {
    const page = document.createElement('div');
    const ul = document.createElement('ul');
    page.id = 'page'.concat(currPage);
    page.className = 'guests-page';
    ul.id = 'ul'.concat(currPage);
    div.appendChild(divSelectedPages);
    divSelectedPages.appendChild(page);
    page.appendChild(h3);
    page.appendChild(ul);
  };

  const determineRowLimit = () => {
    const height = window.innerHeight;
    let limit;
    if (height > 3000) {
      limit = 18;
    } else if (height > 2000) {
      limit = 15;
    } else if (height > 1000) {
      limit = 10;
    } else if (height > 700) {
      limit = 6;
    } else {
      limit = 3;
    }
    return limit;
  };

  // Adding guests with pagination
  // Limit for the number of rows we display per page
  const rowLimit = determineRowLimit();
  const pages = getPageContent(guests, rowLimit);
  const buttonClick = () => {
    document.getElementById('next-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page'.concat(currPage));
      deleteContent(pageContainer);
      currPage += 1;
      displayPage();
      displayGuestsPage(currPage, pages);
      displayPaginationButtons(currPage);
      if (!pages[currPage + 1]) {
        document.getElementById('prev-button').disabled = false;
        document.getElementById('next-button').disabled = true;
      }
      buttonClick();
    });

    document.getElementById('prev-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page'.concat(currPage));
      deleteContent(pageContainer);
      currPage -= 1;
      displayPage();
      displayGuestsPage(currPage, pages);
      displayPaginationButtons(currPage);
      if (!pages[currPage - 1]) {
        document.getElementById('prev-button').disabled = true;
      }
      buttonClick();
    });
  };

  displayPage();
  displayGuestsPage(currPage, pages);
  displayPaginationButtons(currPage);
  buttonClick();
  document.getElementById('prev-button').disabled = true;
  if (!pages[currPage + 1]) {
    document.getElementById('next-button').disabled = true;
  }
}

function selectGuests () {
  const handleSelect = async () => {
    const sent = await fetch('/guests/select/' + currentEvent.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.data && response.success === true) {
        displayGuests(response.data);
      } else if (response.success === true) {
        console.log('no users found');
      }
    } catch (error) {
      printError();
      console.log('guests.js, selectGuests, response error: ' + error);
    }
  };
  handleSelect();
}

function displayPaginationButtons (currPage) {
  // Adding Buttons
  const div = document.getElementById('page'.concat(currPage));
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';
  buttonContainer.className = 'container';
  const nButton = document.createElement('button');
  const pButton = document.createElement('button');
  nButton.className = 'site-button';
  pButton.className = 'site-button';
  nButton.id = 'next-button';
  pButton.id = 'prev-button';
  nButton.title = 'Nächste Seite';
  pButton.title = 'Vorherige Seite';
  nButton.ariaLabel = 'Nächste Seite';
  pButton.ariaLabel = 'Vorherige Seite';
  nButton.innerHTML = 'Nächste Seite';
  pButton.innerHTML = 'Vorherige Seite';
  nButton.type = 'button';
  pButton.type = 'button';
  div.appendChild(buttonContainer);
  buttonContainer.appendChild(pButton);
  buttonContainer.appendChild(nButton);
}

function getPageContent (guests, rowLimit) {
  const p = [];
  let items = [];
  let guest = [];
  let pageCount = 0;
  let countGuests = 0;
  if (guests.length < rowLimit) {
    rowLimit = guests.length;
  }

  console.log(guests);
  for (let index = 0; index < guests.length; index++) {
    if (items.length < rowLimit) {
      countGuests++;
      guest = {
        id: guests[index].ID,
        name: guests[index].Name
      };
      items.push(guest);
    } else {
      p[pageCount] = items;
      pageCount++;
      items = [];
      index--;
    }
    if (countGuests === guests.length) {
      p[pageCount] = items;
    }
  }
  return p;
}

function displayGuestsPage (pageNum, pages) {
  const p = document.getElementById('page'.concat(pageNum));
  const ul = document.getElementById('ul'.concat(pageNum));
  p.appendChild(ul);
  for (let i = 0; i < pages[pageNum].length; i++) {
    const li = document.createElement('li');
    const guest = pages[pageNum][i];
    li.innerHTML = guest.name;
    li.id = guest.id;

    // Button
    const button = document.createElement('div');
    button.id = 'button-container-edit'.concat(guest.id);
    button.className = 'container';
    const editBtn = document.createElement('button');
    editBtn.className = 'site-button';
    editBtn.id = 'edit-button'.concat(guest.id);
    editBtn.title = 'bearbeiten';
    editBtn.ariaLabel = 'Veranstaltung bearbeiten';
    editBtn.innerHTML = 'bearbeiten';
    editBtn.type = 'button';
    li.appendChild(button);
    button.appendChild(editBtn);
    button.style.display = 'none';
    li.addEventListener('click', function () {
      editButton(guest.id);
      editListener(guest);
    });
    // currentEvent.id = guest.id; guest.id wird hier nicht mehr stimmen, weil das jetzt die ID des Gastes ist
    ul.appendChild(li);
  }
}

// Button listener for insert guests
function buttonListenerInsert () {
  document.getElementById('insertGuestsButton').addEventListener('click', (e) => {
    // prevent forwarding
    e.preventDefault();

    const name = document.getElementById('inputName').value;
    let children = 0;
    if (document.getElementById('checkboxChild').checked) {
      children = 1;
    }

    const invitationStatus = document.getElementById('selectInvitation').value;
    const data = { name, children, invitationStatus };
    const form = document.getElementById('insertGuestsForm');
    const divSelectPages = document.getElementById('selectedGuestsPages');
    console.log(divSelectPages);
    const handleInsert = async () => {
      const sent = await fetch('/guests/insert/' + currentEvent.id, {
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
          } else if (response.errorMessage === 'exists') {
            printError('Die Person ist schon in dem Event eingetragen!');
          } else {
            printError();
          }
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          form.reset();
          deleteContent(divSelectPages);
          selectGuests();
        } else {
          printError();
          console.log('response error: \n' + error);
        }
      }
    };
    handleInsert();
  });
}

function editButton (id) {
  const buttonContainer = document.getElementById('button-container-edit'.concat(id));
  if (buttonContainer) {
    if (buttonContainer.style.display === 'none') {
      buttonContainer.style.display = 'flex';
    } else {
      buttonContainer.style.display = 'none';
    }
  }
}

function editListener (guest) {
  const button = document.getElementById('edit-button'.concat(guest.id));
  if (button) {
    button.addEventListener('click', function () {
      // currentEvent.id = this.id.replace('edit-button', '');
      console.log('buttonlistener funktioniert');
      const home = document.getElementById('insertGuestsSection');
      deleteContent(home);
      displayEditGuestPage(guest);
    });
  }
  console.log(guest.id);
}

function displayEditGuestPage (guest) {
  console.log('Gast '.concat(guest.id).concat(' der Veranstaltung ').concat(currentEvent.id).concat(' sollen geändert werden.'));
  const form = guestsForm(guest);
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const saveButton = document.createElement('button');
  h2.innerHTML = 'Gästeliste:';
  div.id = 'insertGuestsDiv';
  div.className = 'box';
  h3.innerHTML = 'Neue Gäste eintragen';
  section.id = 'insertGuestsSection';
  saveButton.type = 'button';
  saveButton.className = 'site-button';
  saveButton.id = 'editGuestsButton';
  saveButton.innerHTML = 'Speichern & zurück';
  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(div);
  div.appendChild(h3);
  div.appendChild(form);
  div.appendChild(saveButton);
  // saveListener();
}
