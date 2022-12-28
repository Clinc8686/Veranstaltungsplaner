import { printError } from './global';
// Button listener for insert table
document.getElementById('insertTables').addEventListener('click', (e) => {
  // prevent forwarding
  e.preventDefault();

  const numberOfTables = document.getElementById('numberOfTables').value;
  const seatsPerTable = document.getElementById('seatsPerTable').value;
  let twoSides = 0;
  if (document.getElementById('twoSides').checked) {
    twoSides = 1;
  }
  const data = { numberOfTables, seatsPerTable, twoSides };

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

      if (response.success === false) {
        printError();
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // loadEvents();
      } else {
        printError();
        console.log('response error: \n' + error);
      }
    }
  };

  handleInsert();
});
