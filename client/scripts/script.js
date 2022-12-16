window.onload = function () {
  document.getElementById('selectAll').addEventListener('click', (e) => {
    e.preventDefault();

    const handleFormData = async () => {
      const sent = await fetch('/guests/select/2', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const tableBody = document.getElementById('tableBody');
      try {
        const response = await sent.json();
        for (const key in response.persons) {
          const newRow = tableBody.insertRow();

          const person = response.persons[key];
          for (const personRow in person) {
            const newCell = newRow.insertCell();
            const newText = document.createTextNode(person[personRow]);
            newCell.appendChild(newText);
          }
        }
      } catch (error) {
        console.log('script.js error: ' + error);
      }
    };

    handleFormData();
  });

  // Testing dynamic site load
  document.getElementById('newGuestsButton').onclick = function () {
    document.getElementById('home').style.display = 'none';
    document.getElementById('guests').style.display = 'block';
  };
  document.getElementById('homeButton').onclick = function () {
    document.getElementById('home').style.display = 'block';
    document.getElementById('guests').style.display = 'none';
  };
};
