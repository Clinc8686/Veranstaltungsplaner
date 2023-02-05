import { printError, currentEvent } from './global';
// import { insertNewGuests } from './guests';
import { displayTableConfiguration } from './tables';
// Fires on Page load
window.addEventListener('load', function () {
  loadEvents();
});

// Receives on page load all events
function loadEvents () {
  const handleSelect = async () => {
    const sent = await fetch('/events/select', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.events) {
        printEvents(response.events);
      } else {
        printError();
      }
    } catch (error) {
      console.log('response error: ' + error);
    }
  };
  handleSelect();
}
export function deleteContent (parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  parent.remove();
}
// Prints Events on Landing Page
function printEvents (events) {
  let currentPage = 0;
  // Adding Headline
  const main = document.getElementById('main');
  const home = document.createElement('section');
  const homeH2 = document.createElement('h2');
  home.id = 'home';
  homeH2.innerHTML = 'Bestehende Veranstaltungen:';
  main.appendChild(home);
  home.appendChild(homeH2);
  const displayPages = () => {
    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'page-container';
    const page1 = document.createElement('div');
    page1.id = 'page'.concat(currentPage);
    page1.className = 'box events-page';
    const page2 = document.createElement('div');
    page2.id = 'page'.concat(currentPage + 1);
    page2.className = 'box events-page';
    home.appendChild(container);
    container.appendChild(page1);
    container.appendChild(page2);
  };

  const determineRowLimit = () => {
    const height = window.innerHeight;
    let limit;
    if (height > 3000) {
      limit = 25;
    } else if (height > 2000) {
      limit = 18;
    } else if (height > 1000) {
      limit = 15;
    } else if (height > 700) {
      limit = 10;
    } else {
      limit = 6;
    }
    return limit;
  };

  // Adding events with pagination
  // Limit for the number of rows we display per page
  const eventsSorted = events.sort((a, b) => a.Category.localeCompare(b.Category));
  const rowLimit = determineRowLimit();
  const pages = getPageContent(eventsSorted, rowLimit);

  const buttonClick = () => {
    document.getElementById('next-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page-container');
      const buttonContainer = document.getElementById('button-container');
      deleteContent(pageContainer);
      deleteContent(buttonContainer);
      currentPage += 2;
      displayPages();
      displayEvents(currentPage, pages);
      if (pages[currentPage + 1]) {
        displayEvents(currentPage + 1, pages);
      }
      displayPaginationButtons();
      if (!pages[currentPage + 3]) {
        document.getElementById('prev-button').disabled = false;
        document.getElementById('next-button').disabled = true;
      }
      buttonClick();
    });

    document.getElementById('prev-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page-container');
      const buttonContainer = document.getElementById('button-container');
      deleteContent(pageContainer);
      deleteContent(buttonContainer);
      currentPage -= 2;
      displayPages();
      displayEvents(currentPage, pages);
      displayEvents(currentPage + 1, pages);
      displayPaginationButtons();
      if (!pages[currentPage - 1]) {
        document.getElementById('prev-button').disabled = true;
      }
      buttonClick();
    });
  };

  displayPages();
  displayEvents(currentPage, pages);
  displayEvents(currentPage + 1, pages);
  displayPaginationButtons();
  buttonClick();
  document.getElementById('prev-button').disabled = true;
  if (!pages[currentPage + 2]) {
    document.getElementById('next-button').disabled = true;
  }
}

function getPageContent (events, rowLimit) {
  const pages = [];

  let elements = [];
  let categories = [];
  let pageCount = 0;
  let countEvents = 0;
  if (events.length < rowLimit) {
    rowLimit = events.length;
  }

  for (let index = 0; index < events.length; index++) {
    let element;
    if (!categories.includes(events[index].Category) && elements.length < rowLimit - 1) {
      categories.push(events[index].Category);
      element = {
        type: 'Category',
        content: events[index].Category,
        id: ''
      };
      elements.push(element);
      element = {
        type: 'item',
        content: events[index].Name,
        id: events[index].ID
      };
      countEvents++;
      elements.push(element);
    } else if (categories.includes(events[index].Category) && elements.length < rowLimit) {
      element = {
        type: 'item',
        content: events[index].Name,
        id: events[index].ID
      };
      countEvents++;
      elements.push(element);
    } else if (!elements.length < rowLimit) {
      pages[pageCount] = elements;
      pageCount++;
      elements = [];
      categories = [];
      index--;
    }
    if (countEvents === events.length) {
      pages[pageCount] = elements;
    }
  }
  return pages;
}

function displayEvents (pageNum, pages) {
  const page = document.getElementById('page'.concat(pageNum));
  let category;
  for (const element of pages[pageNum]) {
    if (element.type === 'Category') {
      category = element.content;
      const headline = document.createElement('h3');
      const displayedCategory = document.createElement('div');
      const ul = document.createElement('ul');
      ul.id = 'ul-'.concat(category).concat(pageNum);
      displayedCategory.className = 'events-categories';
      headline.innerHTML = element.content;
      page.appendChild(headline);
      page.appendChild(displayedCategory);
      displayedCategory.appendChild(ul);
    } else if (element.type === 'item') {
      const ul = document.getElementById('ul-'.concat(category).concat(pageNum));
      const li = document.createElement('li');
      li.id = element.id;
      li.innerHTML = element.content;
      ul.appendChild(li);

      // Buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'button-container-deleteEdit'.concat(element.id);
      buttonContainer.className = 'container';
      const deleteButton = document.createElement('button');
      const editButton = document.createElement('button');
      deleteButton.className = 'site-button';
      editButton.className = 'site-button';
      deleteButton.id = 'delete-button'.concat(element.id);
      editButton.id = 'edit-button'.concat(element.id);
      deleteButton.title = 'loeschen';
      editButton.title = 'bearbeiten';
      deleteButton.ariaLabel = 'Veranstaltung löschen';
      editButton.ariaLabel = 'Veranstaltung bearbeiten';
      deleteButton.innerHTML = 'löschen';
      editButton.innerHTML = 'bearbeiten';
      deleteButton.type = 'button';
      editButton.type = 'button';
      li.appendChild(buttonContainer);
      buttonContainer.appendChild(deleteButton);
      buttonContainer.appendChild(editButton);
      buttonContainer.style.display = 'none';
      li.addEventListener('click', function () {
        currentEvent.id = element.id;
        deleteAndEditButton(element.id);
        console.log('deleteAndEditButton: ' + currentEvent.id + ' ' + element.id);
      });
      currentEvent.id = element.id;
      deleteListener(element.id);
      editListener(element.id);
    }
  }
}

function deleteAndEditButton (id) {
  const buttonContainer = document.getElementById('button-container-deleteEdit'.concat(id));
  if (buttonContainer) {
    if (buttonContainer.style.display === 'none') {
      buttonContainer.style.display = 'flex';
    } else {
      buttonContainer.style.display = 'none';
    }
  }
}

function deleteListener (id) {
  const button = document.getElementById('delete-button'.concat(id));
  button.addEventListener('click', (e) => {
    // prevent forwarding
    e.preventDefault();

    const handleDelete = async () => {
      const sent = await fetch('/events/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      try {
        const response = await sent.json();
        if (response.success === false) {
          printError('Das Event konnte nicht gelöscht werden');
        } else if (response.success === true) {
          // Refresh Events or delete id with dom-manipulation
          // Hier entweder ein refresh der webseite verursachen oder per dom-manipulation die id des gelöschten events raus löschen (2. variante würde ich empfehlen da besser & einfacher)
          console.log('Erfolgreich gelöscht!');
        }
      } catch (error) {
        printError('Das Event konnte nicht gelöscht werden');
        console.log('response error: \n' + error);
      }
    };
    handleDelete();
  });
}

function editListener () {
  const button = document.getElementById('edit-button'.concat(currentEvent.id));
  button.addEventListener('click', function () {
    const home = document.getElementById('home');
    deleteContent(home);
    displayTableConfiguration();
    console.log('edit: ' + currentEvent.id);
  });
}

function displayPaginationButtons () {
  // Adding Buttons
  const home = document.getElementById('home');
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'button-container';
  buttonContainer.className = 'container';
  home.appendChild(buttonContainer);
  const nextButton = document.createElement('button');
  const previousButton = document.createElement('button');
  const newEventButton = document.createElement('button');
  nextButton.className = 'site-button';
  previousButton.className = 'site-button';
  newEventButton.className = 'site-button';
  nextButton.id = 'next-button';
  previousButton.id = 'prev-button';
  newEventButton.id = 'newEvent-button';
  nextButton.title = 'Nächste Seite';
  previousButton.title = 'Vorherige Seite';
  newEventButton.title = 'Neue Veranstaltung';
  nextButton.ariaLabel = 'Nächste Seite';
  previousButton.ariaLabel = 'Vorherige Seite';
  newEventButton.ariaLabel = 'Neue Veranstaltung';
  nextButton.innerHTML = 'Nächste Seite';
  previousButton.innerHTML = 'Vorherige Seite';
  newEventButton.innerHTML = 'Neue Veranstaltung';
  nextButton.type = 'button';
  newEventButton.type = 'button';
  previousButton.type = 'button';
  buttonContainer.appendChild(previousButton);
  buttonContainer.appendChild(newEventButton);
  buttonContainer.appendChild(nextButton);

  newEventButton.addEventListener('click', function () {
    const home = document.getElementById('home');
    deleteContent(home);
    displayInsertEventPage();
  });
}

// insert-event page
function displayInsertEventPage () {
  const main = document.getElementById('main');
  const sectionInsertEvent = document.createElement('section');
  const h2 = document.createElement('h2');
  const insertEventContainer = document.createElement('div');
  const form = document.createElement('form');
  const divName = document.createElement('div');
  const labelName = document.createElement('label');
  const inputName = createInput('insertEventInputName', 'text', 'Bezeichnung', 'insertEventInputName');
  const divCategory = document.createElement('div');
  const labelCategory = document.createElement('label');
  const selectCategory = document.createElement('select');
  const optionBirthday = createOptions('Geburtstag');
  const optionMarriage = createOptions('Hochzeit');
  const optionKirchlich = createOptions('Kirchlich'); // should be renamed... everywhere
  const optionOther = createOptions('Sonstiges');
  const divDate = document.createElement('div');
  const labelDate = document.createElement('label');
  const dateNTime = createInput('datetime', 'datetime-local', 'tt.mm.jjjj', 'datetime');
  const divButton = document.createElement('div');
  const nextButton = document.createElement('button');
  sectionInsertEvent.id = 'insertEventSection';
  h2.innerHTML = 'Veranstaltung erstellen';
  insertEventContainer.className = 'box container';
  insertEventContainer.id = 'insertEventContainer';
  divName.id = 'insertEventDivName';
  labelName.id = 'insertEventLabelName';
  labelName.innerHTML = 'Veranstaltungsname:';
  divCategory.id = 'selectDivCategory';
  labelCategory.id = 'selectLabelCategory';
  labelCategory.innerHTML = 'Kategorie:';
  selectCategory.name = 'selectCategory';
  selectCategory.id = 'selectCategory';
  divDate.id = 'insertEventDivDate';
  labelDate.id = 'insertEventLabelDate';
  labelDate.innerHTML = 'Datum und Uhrzeit:';
  divButton.id = 'divInsertEventButton';
  nextButton.id = 'insertEvent';
  nextButton.className = 'site-button';
  nextButton.innerHTML = 'weiter';
  nextButton.type = 'button';
  // Allow only future dates on datetime form
  main.appendChild(sectionInsertEvent);
  sectionInsertEvent.appendChild(h2);
  sectionInsertEvent.appendChild(insertEventContainer);
  insertEventContainer.appendChild(form);
  form.appendChild(divName);
  divName.appendChild(labelName);
  divName.appendChild(inputName);
  form.appendChild(divCategory);
  divCategory.appendChild(labelCategory);
  dateNTime.min = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'));
  selectCategory.appendChild(optionBirthday);
  selectCategory.appendChild(optionMarriage);
  selectCategory.appendChild(optionKirchlich);
  selectCategory.appendChild(optionOther);
  divCategory.appendChild(selectCategory);
  form.appendChild(divDate);
  divDate.appendChild(labelDate);
  divDate.appendChild(dateNTime);
  sectionInsertEvent.appendChild(divButton);
  divButton.appendChild(nextButton);
  insertNewEvent();
}

export function createInput (id, type, placeholder, name) {
  const input = document.createElement('input');
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;
  input.name = name;
  return input;
}

export function createOptions (text) {
  const option = document.createElement('option');
  option.setAttribute(text, text);
  option.innerHTML = text;
  return option;
}
// Button listener for insert events
function insertNewEvent () {
  const button = document.getElementById('insertEvent');
  const section = document.getElementById('insertEventSection');
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const name = document.getElementById('insertEventInputName').value;
    const category = document.getElementById('selectCategory').value;
    const datetime = document.getElementById('datetime').value;
    const data = { name, category, datetime };

    const handleInsert = async () => {
      const sent = await fetch('/events/insert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      try {
        const response = await sent.json();
        if (response.success === false && response.errorMessage === 'notNull') {
          printError('Es müssen alle Felder ausgefüllt werden!');
        } else if (response.success === false) {
          printError();
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          const handleSelect = async () => {
            const sent = await fetch('/events/select', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });

            try {
              const response = await sent.json();
              if (response.events) {
                const events = response.events;
                const ids = events.map(event => {
                  return event.ID;
                });
                currentEvent.id = Math.max(...ids);
                deleteContent(section);
                displayTableConfiguration(currentEvent.id);
              } else {
                printError();
              }
            } catch (error) {
              console.log('response error: ' + error);
            }
          };
          handleSelect();
        } else {
          printError();
          console.log('response error: \n' + error);
        }
      }
    };
    handleInsert();
  });
}
