import { printError, currentEvent } from './global';
import { insertNewGuests } from './guests';
import { displayTableConfiguration } from './tables';
// Fires on Page load
window.addEventListener('load', function () {
  loadEvents();
});

window.addEventListener('resize', () => {
  const section = document.getElementById('home');
  if (section) {
    deleteContent(section);
    loadEvents();
  }
});
// Receives on page load all events
export function loadEvents () {
  const handleSelect = async () => {
    const sent = await fetch('/events/select', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.data) {
        printEvents(response.data);
      } else if (response.success === true) {
        // success
        printEvents();
      } else {
        printError();
      }
    } catch (error) {
      console.log('events.js, loadEvents, response error: ' + error);
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
      limit = 13;
    } else if (height > 2000) {
      limit = 9;
    } else if (height > 1000) {
      limit = 7;
    } else if (height > 900) {
      limit = 6;
    } else if (height > 800) {
      limit = 5;
    } else if (height > 700) {
      limit = 4;
    } else {
      limit = 3;
    }
    return limit; // the date needs place too
  };

  displayPages();
  const p = document.createElement('p');
  p.innerHTML = 'Es wurden noch keine Veranstaltungen erstellt.';
  p.hidden = true;
  home.appendChild(p);
  displayPaginationButtons();

  // Adding events with pagination
  // Limit for the number of rows we display per page
  let eventsSorted;
  const rowLimit = determineRowLimit();
  let pages;
  if (events) {
    eventsSorted = events.sort((a, b) => a.Category.localeCompare(b.Category));
    pages = getPageContent(eventsSorted, rowLimit);
    const container = document.getElementById('button-container');
    deleteContent(container);
    displayEvents(currentPage, pages);
    pageNumDisplay(currentPage, pages);
    displayPaginationButtons();

    if (pages[currentPage + 1]) {
      displayEvents(currentPage + 1, pages);
    }
  } else {
    p.hidden = false;
    document.getElementById('next-button').disabled = true;
  }

  const buttonClick = () => {
    document.getElementById('next-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page-container');
      const buttonContainer = document.getElementById('button-container');
      const pageNumContainer = document.getElementById('pageNumberDiv');
      deleteContent(pageContainer);
      deleteContent(buttonContainer);
      deleteContent(pageNumContainer);
      currentPage += 2;
      displayPages();
      displayEvents(currentPage, pages);
      pageNumDisplay(currentPage, pages);
      if (pages[currentPage + 1]) {
        displayEvents(currentPage + 1, pages);
      }
      displayPaginationButtons();
      if (!pages[currentPage + 2]) {
        document.getElementById('prev-button').disabled = false;
        document.getElementById('next-button').disabled = true;
      }
      buttonClick();
    });

    document.getElementById('prev-button').addEventListener('click', function () {
      const pageContainer = document.getElementById('page-container');
      const buttonContainer = document.getElementById('button-container');
      const pageNumContainer = document.getElementById('pageNumberDiv');
      deleteContent(pageContainer);
      deleteContent(buttonContainer);
      deleteContent(pageNumContainer);
      currentPage -= 2;
      displayPages();
      displayEvents(currentPage, pages);
      pageNumDisplay(currentPage, pages);
      displayEvents(currentPage + 1, pages);
      displayPaginationButtons();
      if (!pages[currentPage - 1]) {
        document.getElementById('prev-button').disabled = true;
      }
      buttonClick();
    });
  };

  buttonClick();
  document.getElementById('prev-button').disabled = true;
  if (!pages[currentPage + 2]) {
    document.getElementById('next-button').disabled = true;
  }
}

function pageNumDisplay (currentPage, pages) {
  const section = document.getElementById('home');
  const div = document.createElement('div');
  const p = document.createElement('p');
  const pageNum1 = document.createElement('p');
  const pageNum2 = document.createElement('p');
  pageNum1.innerHTML = currentPage + 1;
  pageNum2.innerHTML = currentPage + 2;
  const pagesNum = pages.length;
  div.id = 'pageNumberDiv';
  p.innerHTML = 'maximale Seitenanzahl: '.concat(pagesNum);
  section.appendChild(div);
  div.appendChild(pageNum1);
  div.appendChild(p);
  div.appendChild(pageNum2);
}
function getPageContent (events, rowLimit) {
  const pages = [];
  let elements = [];
  let categories = [];
  let pageCount = 0;
  let countEvents = 0;
  const eventsLength = events.length;
  let categoryCount = 0;
  if (eventsLength < rowLimit) {
    for (const event of events) {
      if (!categories.includes(event.Category)) {
        categories.push(event.Category);
        categoryCount++;
      }
    }
    categories = [];
  }
  const pageElementCount = eventsLength + categoryCount; // + categoryCount because of the headlines (categories)
  if (pageElementCount < rowLimit) {
    rowLimit = pageElementCount;
  }
  for (let index = 0; index < eventsLength; index++) {
    let element;
    let date = events[index].Datetime;
    date = new Date(date).toString();
    date = date.split(' ');
    // if space on page and category isn't there
    if (!categories.includes(events[index].Category) && elements.length < rowLimit - 1) {
      categories.push(events[index].Category);
      element = {
        type: 'Category',
        content: events[index].Category,
        id: '',
        date: ''
      };
      elements.push(element);
      element = {
        type: 'item',
        content: events[index].Name,
        id: events[index].ID,
        date: date[2].concat('. ').concat(date[1]).concat(' ').concat(date[3]).concat(' ').concat(date[4])
      };
      countEvents++;
      elements.push(element);
      // if space on page and category already there
    } else if (categories.includes(events[index].Category) && elements.length < rowLimit) {
      element = {
        type: 'item',
        content: events[index].Name,
        id: events[index].ID,
        date: date[2].concat('. ').concat(date[1]).concat(' ').concat(date[3]).concat(' ').concat(date[4])
      };
      countEvents++;
      elements.push(element);
      // if no space on page
    } else if (!elements.length < rowLimit) {
      pages[pageCount] = elements;
      pageCount++;
      elements = [];
      categories = [];
      index--;
    }
    // are all events in pages?
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
      const p = document.createElement('p');
      li.id = element.id;
      li.innerHTML = element.content;
      p.innerHTML = element.date;
      li.appendChild(p);
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
        deleteAndEditButton(element.id);
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
  const event = document.getElementById(id);
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
          deleteContent(event);
        }
      } catch (error) {
        printError('Das Event konnte nicht gelöscht werden');
        console.log('response error: \n' + error);
      }
    };
    handleDelete();
  });
}

function editListener (id) {
  const button = document.getElementById('edit-button'.concat(id));
  button.addEventListener('click', function () {
    currentEvent.id = this.id.replace('edit-button', '');
    const home = document.getElementById('home');
    deleteContent(home);
    insertNewGuests();
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
          printError('2');
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
              if (response.data) {
                const events = response.data;
                const ids = events.map(event => {
                  return event.ID;
                });
                currentEvent.id = Math.max(...ids);
                deleteContent(section);
                displayTableConfiguration();
              } else {
                printError('3');
              }
            } catch (error) {
              console.log('events.js, insertNewEvent(1), response error: ' + error);
            }
          };
          handleSelect();
        } else {
          printError('4');
          console.log('events.js, insertNewEvent(2), response error: \n' + error);
        }
      }
    };
    handleInsert();
  });
}
