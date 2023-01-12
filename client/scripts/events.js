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
        if (response.errorMessage === 'notNull') {
          printError('Es müssen alle Felder ausgefüllt werden!');
        } else {
          printError();
        }
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
  const eventCategories = document.getElementsByClassName('events-categories');
  const categories = ['Geburtstag', 'Hochzeit', 'Kirchlich', 'Sonstiges'];

  // Removes all ul and li tags
  let i = 0;
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
  }

  // Prints all ul and li tags new with eventnames
  i = 0;
  for (const categoriesKey in categories) {
    const ul = document.createElement('ul');
    for (const responseKey in response.events) {
      if (categories[categoriesKey] === response.events[responseKey].Category) {
        const li = document.createElement('li');
        li.innerHTML = response.events[responseKey].Name;
        ul.appendChild(li);
      }
    }
    eventCategories[i].appendChild(ul);
    i++;
  }
}
