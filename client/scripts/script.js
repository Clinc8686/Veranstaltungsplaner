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

  document.getElementById('child').addEventListener('change', function (e) {
    const childNum = document.getElementById('childrenNumber');
    if (e.target.checked) {
      childNum.style.display = 'block';
      console.log('checked!');
    } else {
      childNum.style.display = 'none';
      console.log('not checked');
    }
  });
};
