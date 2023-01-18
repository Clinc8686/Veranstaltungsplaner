import { printError } from './global';
// Fires on Page load
window.addEventListener('load', function () {
  loadEvents();
});

// Receives on page load all events
function loadEvents () {
  const handleSelect = async () => {
    const sent = await fetch('/events/select/2', {
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
      const pagecontainer = document.getElementById('page-container');
      const buttoncontainer = document.getElementById('button-container');
      deleteContent(pagecontainer);
      deleteContent(buttoncontainer);
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
      const pagecontainer = document.getElementById('page-container');
      const buttoncontainer = document.getElementById('button-container');
      deleteContent(pagecontainer);
      deleteContent(buttoncontainer);
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
        content: events[index].Category
      };
      elements.push(element);
      element = {
        type: 'item',
        content: events[index].Name
      };
      countEvents++;
      elements.push(element);
    } else if (categories.includes(events[index].Category) && elements.length < rowLimit) {
      element = {
        type: 'item',
        content: events[index].Name
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
      li.innerHTML = element.content;
      ul.appendChild(li);
    }
  }
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
  const insertEventContainer = document.createElement('div');
  const form = document.createElement('form');
  const labelName = document.createElement('label');
  const inputName = createInput('insertEventInputName', 'text', 'Bezeichnung', 'insertEventInputName');
  const labelCategory = document.createElement('label');
  const selectCategory = document.createElement('select');
  const optionBirthday = createOptions('Geburtstag');
  const optionMarriage = createOptions('Hochzeit');
  const optionKirchlich = createOptions('Kirchlich'); // should be renamed... everywhere
  const optionOther = createOptions('Sonstiges');
  const labelDate = document.createElement('label');
  const dateNTime = createInput('datetime', 'datetime-local', 'tt.mm.jjjj', 'datetime');
  sectionInsertEvent.id = 'insertEvent';
  insertEventContainer.className = 'box container';
  insertEventContainer.id = 'insertEventContainer';
  labelName.id = 'insertEventLabelName';
  labelName.innerHTML = 'Veranstaltungsname:';
  labelCategory.id = 'selectLabelCategory';
  labelCategory.innerHTML = 'Kategorie:';
  selectCategory.name = 'selectCategory';
  selectCategory.id = 'selectCategory';
  labelDate.id = 'insertEventLabelDate';
  labelDate.innerHTML = 'Datum und Uhrzeit:';
  // Allow only future dates on datetime form
  dateNTime.min = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'));
  selectCategory.appendChild(optionBirthday);
  selectCategory.appendChild(optionMarriage);
  selectCategory.appendChild(optionKirchlich);
  selectCategory.appendChild(optionOther);
  main.appendChild(sectionInsertEvent);
  sectionInsertEvent.appendChild(insertEventContainer);
  insertEventContainer.appendChild(form);
  form.appendChild(labelName);
  form.appendChild(inputName);
  form.appendChild(labelCategory);
  form.appendChild(selectCategory);
  form.appendChild(labelDate);
  form.appendChild(dateNTime);
}

function createInput (id, type, placeholder, name) {
  const input = document.createElement('input');
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;
  input.name = name;
  return input;
}

function createOptions (text) {
  const option = document.createElement('option');
  option.setAttribute(text, text);
  option.innerHTML = text;
  return option;
}
// Button listener for insert events
document.getElementById('insertEvent').addEventListener('click', (e) => {
  // prevent forwarding
  e.preventDefault();

  const name = document.getElementById('eventName').value;
  const category = document.getElementById('category').value;
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
      if (response.success === false) {
        printError();
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        loadEvents();
      } else {
        printError();
        console.log('response error: \n' + error);
      }
    }
  };

  handleInsert();
});

// Allow only future dates on datetime form
document.getElementById('datetime').min = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'));

function deleteContent (parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
  parent.remove();
}
