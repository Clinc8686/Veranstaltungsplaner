import { currentEvent, printError } from './global';
import { createInputRow, insertNewGuests } from './guests.js';
import { deleteContent } from './events';

let seatingTableID;

export function displayTableConfiguration () {
  console.log('Die Tischkonfiguration der Veranstaltung '.concat(currentEvent.id).concat(' soll geändert werden.'));
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

  // Add Table values from database into form
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
        return response.data[0];
      }
    } catch (error) {
      console.log('tables.js, getTableInfo, response error: ' + error);
    }
  };
  handleSelect().then((dataValue) => {
    if (dataValue) {
      document.getElementById('inputAmountTables').value = dataValue.Tables;
      document.getElementById('inputAmountChairs').value = dataValue.Seats;
      document.getElementById('checkboxOneSided').checked = dataValue.Onesided;
      seatingTableID = dataValue.ID;
    }
  });

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
      let sent;
      if (seatingTableID) {
        sent = await fetch('/tables/update/' + seatingTableID, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } else {
        sent = await fetch('/tables/insert/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }

      try {
        const response = await sent.json();
        if (response.success === false) {
          printError();
        } else if (response.success === true) {
          // hier weiter bei erfolgreich
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          const section = document.getElementById('sectionTableConfigurations');
          deleteContent(section);
          insertNewGuests();
        } else {
          printError();
          console.log('tables.js, buttonListener, response error: \n' + error);
        }
      }
    };

    handleInsert();
  });
}

export function displaySeatinplan () {
  console.log('Sitzplan von Veranstaltung '.concat(currentEvent.id).concat(' soll angezeigt werden.'));
  const main = document.getElementById('main');
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  const div = document.createElement('div');
  section.id = 'sectionSeatingplan';
  h2.innerHTML = 'Sitzplan:';
  div.className = 'box container';
  main.appendChild(section);
  section.appendChild(h2);
  section.appendChild(div);
}
