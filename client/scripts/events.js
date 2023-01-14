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
        printEvents(response);
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

// Prints Events on Landing Page
function printEvents (events) {
  let currentPage = 0;

  // Adding Headline
  const home = document.getElementById('home');
  const homeH2 = document.createElement('h2');
  homeH2.innerHTML = 'Bestehende Veranstaltungen:';
  home.appendChild(homeH2);
  const displayPages = () => {
    const container = document.createElement('div');
    container.className = 'container';
    const page1 = document.createElement('div');
    page1.id = 'page'.concat(currentPage);
    page1.className = 'events-page';
    const page2 = document.createElement('div');
    page2.id = 'page'.concat(currentPage + 1);
    page2.className = 'events-page';
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
      const page1 = document.getElementById('page'.concat(currentPage));
      const page2 = document.getElementById('page'.concat(currentPage + 1));
      deletePageContent(page1);
      deletePageContent(page2);
      deleteButtons();
      currentPage += 2;
      displayPages();
      displayEvents(currentPage, pages);
      if (pages[currentPage + 1]) {
        displayEvents(currentPage + 1, pages);
      }
      displayButtons();
      if (!pages[currentPage + 3]) {
        document.getElementById('prev-button').disabled = false;
        document.getElementById('next-button').disabled = true;
      }
      buttonClick();
    });

    document.getElementById('prev-button').addEventListener('click', function () {
      const page1 = document.getElementById('page'.concat(currentPage));
      const page2 = document.getElementById('page'.concat(currentPage + 1));
      deletePageContent(page1);
      deletePageContent(page2);
      deleteButtons();
      currentPage -= 2;
      displayPages();
      displayEvents(currentPage, pages);
      displayEvents(currentPage + 1, pages);
      displayButtons();
      if (!pages[currentPage - 1]) {
        document.getElementById('prev-button').disabled = true;
      }
    } else {
      listItems[response.events[resKey].Category] = [response.events[resKey].Name];
    }
  }
  // const listSize = listItems.length;
  let currentPage = 0;
  const paginationLimit = 6; // muss let werden, sobald die Höheneinstellungen gemacht sind
  // const pageCount = Math.ceil(listSize / paginationLimit); wird später noch benötigt fürs disablen der Buttons
  const alreadyOnPage = [];
  const setForwardPage = (page) => {
    currentPage = currentPage + 1;
    const prevRange = (currentPage - 1) * paginationLimit;
    const currentRange = currentPage * paginationLimit;
    let k = 0;
    // const nextRange = (currentPage + 1) * paginationLimit; später noch benötigt
    for (let j = prevRange; j <= currentRange; j++) {
      if (j <= currentRange - 1) {
        const currentCategory = categories[k];
        const ul = document.createElement('ul');
        const eventCategory = document.createElement('div');
        eventCategory.className = 'events-categories';
        const categoryName = document.createElement('h3');
        categoryName.innerHTML = currentCategory;
        if (!alreadyOnPage.includes(currentCategory)) {
          page.appendChild(categoryName);
          page.appendChild(eventCategory);
          alreadyOnPage.push(currentCategory);
          j++;
        }
        for (let i = 0; i < listItems[currentCategory].length; i++) {
          if (j <= currentRange && !alreadyOnPage.includes(listItems[currentCategory][i])) {
            const listItem = document.createElement('li');
            listItem.innerHTML = listItems[currentCategory][i];
            eventCategory.appendChild(ul);
            ul.appendChild(listItem);
            alreadyOnPage.push(listItems[currentCategory][i]);
            j++;
          } else {
            break;
          }
        }
      } else {
        break;
      }
      k++;
    }
  };
  setForwardPage(page1);
  setForwardPage(page2);
  console.log(listItems);
  console.log(alreadyOnPage);
  /*
  // Adding events
  // Prints all ul and li tags new with eventnames
  let i = 0;
  for (const categoriesKey in categories) {
    const ul = document.createElement('ul');
    const eventCategory = document.createElement('div');
    const categoryName = document.createElement('h3');
    eventCategory.className = 'events-categories';
    const eventCategories = document.getElementsByClassName('events-categories');
    page1.appendChild(categoryName);
    page1.appendChild(eventCategory);
    for (const responseKey in response.events) {
      if (categories[categoriesKey] === response.events[responseKey].Category) {
        categoryName.innerHTML = response.events[responseKey].Category;
        const li = document.createElement('li');
        li.innerHTML = response.events[responseKey].Name;
        ul.appendChild(li);
      }
    }
    eventCategories[i].appendChild(ul);
    i++;
  }
  */
  // Next Page, Prevoius Page and New Event Buttons
  const buttonContainer = document.createElement('div');
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

  document.getElementById('next-button').addEventListener('click', function () {
    deletePageContent(page1);
    deletePageContent(page2);
    // setForwardPage(page1);
    // setForwardPage(page2);
  });
  const deletePageContent = (page) => {
    for (const child in page.children) {
      console.log(child);
    }
    /*
    if (page.hasChildNodes()) {
      const e = document.querySelector('ul');
      const h = document.querySelector('h3');
      let first = e.firstElementChild;
      while (first) {
        first.remove();
        first = e.firstElementChild;
      }
      e.remove();
      h.remove();
    } */
  };
  // Removes all ul and li tags
  /* let i = 0;
  for (const categoriesKey in categories) {
    for (const responseKey in response.events) {
      if (eventCategories[i].children.length > 0) {
        if (categories[categoriesKey] === response.events[responseKey].Category) {
          while (eventCategories[i].firstElementChild.firstElementChild) {
            eventCategories[i].firstElementChild.firstElementChild.remove();
          }
        }
        eventCategories[i].firstElementChild.remove();
      }
    }
    i++;
  } */
}
