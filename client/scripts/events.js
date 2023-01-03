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
function printEvents (response) {
  // const eventCategories = document.getElementsByClassName('events-categories');
  const categories = ['Geburtstag', 'Hochzeit', 'Kirchlich', 'Sonstiges'];

  // Adding Headline
  const home = document.getElementById('home');
  const homeH2 = document.createElement('h2');
  homeH2.innerHTML = 'Bestehende Veranstaltungen:';
  home.appendChild(homeH2);

  // Adding divs
  const container = document.createElement('div');
  container.className = 'container';
  const page1 = document.createElement('div');
  page1.className = 'events-page';
  const page2 = document.createElement('div');
  page2.className = 'events-page';
  home.appendChild(container);
  container.appendChild(page1);
  container.appendChild(page2);

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
