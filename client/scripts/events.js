// Receives on page load all events
window.addEventListener('load', function () {
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
});

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
        console.log('event created');
      } else {
        printError();
        console.log('response error: \n' + error);
      }
    }
  };

  handleInsert();
});

// Print error message
function printError () {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error';
  const errorSpan = document.createElement('span');
  errorSpan.className = 'closebtn';
  errorSpan.innerHTML = '&times';
  errorDiv.appendChild(errorSpan);
  const errorText = document.createTextNode('Da hat etwas nicht geklappt!');
  errorDiv.appendChild(errorText);

  const header = document.getElementsByTagName('header')[0];
  document.body.insertBefore(errorDiv, header);

  errorSpan.addEventListener('click', (e) => {
    const error = document.getElementById('error');
    error.remove();
  });
}

// Allow only future dates on datetime form
document.getElementById('datetime').min = new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(':'));

// Prints Events on Landing Page
function printEvents (response) {
  const eventCategories = document.getElementsByClassName('events-categories');
  const categories = ['Geburtstag', 'Hochzeit', 'Kirchlich', 'Sonstiges'];

  let i = 0;
  for (const categoriesKey in categories) {
    for (const responseKey in response.events) {
      if (categories[categoriesKey] === response.events[responseKey].Category) {
        const li = document.createElement('li');
        li.innerHTML = response.events[responseKey].Name;
        eventCategories[i].firstElementChild.appendChild(li);
      }
    }
    i++;
  }
}
