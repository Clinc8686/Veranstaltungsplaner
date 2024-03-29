import { currentEvent, printError } from './global';
import { createInputRow, insertNewGuests } from './guests.js';
import { deleteContent, loadEvents } from './events';

export function displayTableConfiguration () {
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  const form = document.createElement('form');
  const amountTables = createInputRow('inputAmountTables', 'number', '1', 'inputAmountTable', 'Anzahl Tische:');
  const amountChairs = createInputRow('inputAmountChairs', 'number', '1', 'inputAmountChairs', 'Anzahl Stühle pro Tisch:');
  const oneSidedCheckbox = createInputRow('checkboxOneSided', 'checkbox', 'Nein', 'checkboxOneSided', 'Einseitig bestuhlt?:');
  const divButton = document.createElement('div');
  const submitButton = document.createElement('button');
  section.id = 'sectionTableConfigurations';
  h2.innerHTML = 'Tischbelegung:';
  div.className = 'box container';
  amountTables.min = 1;
  amountChairs.min = 1;
  amountChairs.value = 133;
  divButton.id = 'divTableConfigurationsButton';
  submitButton.type = 'button';
  submitButton.className = 'site-button';
  submitButton.id = 'tableConfigurationsButton';
  submitButton.innerHTML = 'weiter';

  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(div);
  div.appendChild(form);
  form.appendChild(amountTables);
  form.appendChild(amountChairs);
  form.appendChild(oneSidedCheckbox);
  section.appendChild(divButton);
  divButton.appendChild(submitButton);
  buttonListener(submitButton);
}

// button listener and sending table data to server and handle response
function buttonListener (button) {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    const numberOfTables = document.getElementById('inputAmountTables').value;
    const seatsPerTable = document.getElementById('inputAmountChairs').value;
    let twoSides = 0;
    if (document.getElementById('checkboxOneSided').checked) {
      twoSides = 1;
    }
    const eventID = currentEvent.id;
    const data = { numberOfTables, seatsPerTable, twoSides, eventID };

    const handleInsert = async () => {
      const sent = await fetch('/tables/insert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      try {
        const response = await sent.json();
        if (response.errorMessage === 'notNull') {
          printError('Es müssen alle Textfelder ausgefüllt werden!');
        } else if (response.success === false) {
          printError();
        } else if (response.success === true) {
          const section = document.getElementById('sectionTableConfigurations');
          deleteContent(section);
          insertNewGuests();
        }
      } catch (error) {
        printError();
      }
    };

    handleInsert();
  });
}

// displays the basic structur of seating plan page

export function displaySeatinplan () {
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const explanation = document.createElement('p');
  const div = document.createElement('div');
  section.id = 'sectionSeatingplan';
  h2.innerHTML = 'Sitzplan:';
  explanation.innerHTML = 'Der Sitzplan kann mit festhalten und loslassen (drag and drop) geändert werden.';
  div.className = 'box container';
  div.id = 'seatingPlanDiv';
  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(explanation);
  section.appendChild(div);
  selectTableConfiguration();
}

// Sending event id to sever to get all table data and handle response
function selectTableConfiguration () {
  const handleSelect = async () => {
    const sent = await fetch('/tables/select/' + currentEvent.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.data) {
        displayTables(response.data[0]);
      }
    } catch (error) {
      printError();
    }
  };
  handleSelect();
}

// displays seating plan table
function displayTables (config) {
  const oneSided = config.Onesided;
  const tableCount = config.Tables;
  const seatCount = config.Seats;
  const section = document.getElementById('sectionSeatingplan');
  const div = document.getElementById('seatingPlanDiv');
  const seatPlan = document.createElement('table');
  const headline = document.createElement('tr');
  const empty = document.createElement('th');
  const containerButton = document.createElement('div');
  const button = document.createElement('button');
  containerButton.id = 'startpageButtonContainer';
  button.id = 'startpageButton';
  button.innerHTML = 'speichern & zurück';
  button.type = 'button';
  button.className = 'site-button';
  seatPlan.id = 'table';

  // table headline if both sided chairs
  if (!oneSided) {
    const emptyCount = Math.round((seatCount - 2) / 2);
    const headln = document.createElement('tr');
    const empty = document.createElement('th');
    const front = document.createElement('th');
    const back = document.createElement('th');
    front.innerHTML = 'vorne';
    back.innerHTML = 'hinten';
    headln.appendChild(empty);
    headln.appendChild(front);
    for (let i = 0; i < emptyCount; i++) {
      const empty = document.createElement('th');
      headln.appendChild(empty);
    }
    headln.appendChild(back);
    for (let i = 0; i < emptyCount; i++) {
      const empty = document.createElement('th');
      headln.appendChild(empty);
    }
    seatPlan.appendChild(headln);
  }

  headline.appendChild(empty);

  for (let h = 1; h <= seatCount; h++) {
    const seat = document.createElement('th');
    seat.innerHTML = 'Stuhl '.concat(h);
    headline.appendChild(seat);
  }
  seatPlan.appendChild(headline);
  for (let i = 1; i <= tableCount; i++) {
    const tableRow = document.createElement('tr');
    tableRow.id = i;
    const head = document.createElement('th');
    head.id = 'table'.concat(i);
    head.innerHTML = 'Tisch '.concat(i);
    tableRow.appendChild(head);
    for (let k = 1; k <= seatCount; k++) {
      const cell = document.createElement('td');
      cell.id = 'table,'.concat(i).concat(',seat,').concat(k);
      cell.className = 'dropzone';
      tableRow.appendChild(cell);
    }
    seatPlan.appendChild(tableRow);
  }
  div.appendChild(seatPlan);
  section.appendChild(containerButton);
  containerButton.appendChild(button);
  button.addEventListener('click', () => {
    deleteContent(section);
    loadEvents();
  });
  dropFunctions();
  loadSeats(currentEvent.id, tableCount, seatCount);
}

// load all seats from specific eventID
function loadSeats (eventID, tableCount, seatCount) {
  const handleSelect = async () => {
    const sent = await fetch('/seats/select/' + eventID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    try {
      const response = await sent.json();
      if (response.data) {
        fillTableConfiguration(response.data, tableCount, seatCount);
      } else {
        printError();
      }
    } catch (error) {
      printError();
    }
  };
  handleSelect();
}

function fillTableConfiguration (seatPlan, tableCount, seatCount) {
  let plan = new Array(tableCount);
  for (let t = 0; t < tableCount; t++) {
    plan[t] = new Array(seatCount);
  }
  plan = alreadySeated(seatPlan, plan);
  plan = newSeating(seatPlan, plan);
  displaySeats(plan);
}

function alreadySeated (seatPlan, plan) {
  let seat = [];
  for (const guest of seatPlan) {
    const s = guest.Seat;
    const t = guest.Bench;
    if (s && t && !plan[t - 1][s - 1]) {
      seat = {
        id: guest.Guests,
        name: guest.Name
      };
      plan[t - 1][s - 1] = seat;
    }
  }
  return plan;
}

function newSeating (seatPlan, plan) {
  for (const guest of seatPlan) {
    if (!alreadyInPlan(guest, plan)) {
      plan = addToPlan(guest, plan);
    }
  }
  return plan;
}

function alreadyInPlan (guest, plan) {
  for (let t = 0; t < plan.length; t++) {
    for (let s = 0; s < plan[t].length; s++) {
      if (plan[t][s]) {
        if (plan[t][s].id === guest.Guests) {
          return true;
        }
      }
    }
  }
  return false;
}

function addToPlan (guest, plan) {
  for (let t = 0; t < plan.length; t++) {
    for (let s = 0; s < plan[t].length; s++) {
      if (!plan[t][s]) {
        plan[t][s] = {
          id: guest.Guests,
          name: guest.Name
        };
        selectListenerAddGuest(guest.Guests, s + 1, t + 1, currentEvent.id);
        return plan;
      }
    }
  }
  return plan;
}

// build json for sending changed guest data
function selectListenerAddGuest (guestID, seat, bench, eventID) {
  const url = '/seats/update/' + guestID;
  const data = { seat, bench, eventID };
  sendRequest(url, data);
}
// build json for sending changed guests data
function selectListenerChangeGuests (guestID1, guestID2) {
  const url = '/seats/update/';
  const data = { guestID1, guestID2 };
  sendRequest(url, data);
}

// Sending data to server and handle response
function sendRequest (url, data) {
  const handleInsert = async () => {
    const sent = await fetch(url, {
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
      printError();
    }
  };
  handleInsert();
}

function displaySeats (plan) {
  for (let t = 0; t < plan.length; t++) {
    for (let s = 0; s < plan[t].length; s++) {
      const guest = plan[t][s];
      if (guest) {
        const seat = document.getElementById('table,'.concat(t + 1).concat(',seat,').concat(s + 1));
        const p = document.createElement('p');
        p.id = guest.id;
        p.innerHTML = guest.name;
        p.draggable = true;
        drag(p);
        seat.appendChild(p);
      }
    }
  }
}

// Drag and Drop functions
function dropFunctions () {
  const tds = document.getElementsByClassName('dropzone');
  for (const td of tds) {
    td.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    td.addEventListener('drop', (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('text');
      const dragElement = document.getElementById(data);
      const dragElementClone = dragElement.cloneNode(true);
      const targetElement = event.currentTarget;
      const targetElementContent = targetElement.firstChild;
      if (targetElementContent) {
        const targetElementContentClone = targetElementContent.cloneNode(true);
        drag(targetElementContentClone);
        drag(dragElementClone);
        dragElement.replaceWith(targetElementContentClone);
        targetElementContent.replaceWith(dragElementClone);
        selectListenerChangeGuests(targetElementContent.id, dragElement.id);
      } else {
        td.appendChild(document.getElementById(data));
        const id = targetElement.id;
        const places = id.split(',');
        const bench = places[1];
        const seat = places[3];
        selectListenerAddGuest(data, seat, bench, currentEvent.id);
      }
    });
  }
}

function drag (p) {
  p.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text', event.target.id);
  });
}
