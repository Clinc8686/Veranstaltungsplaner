window.onload = function () {
  document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();

    // const username = document.getElementById('username').value;
    // const email = document.getElementById('email').value;
    const li = document.querySelector('li');

    // const data = { username, email };

    const handleFormData = async () => {
      const sent = await fetch('/guests/select', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      try {
        const response = await sent.json();
        let str = '';
        for (const key in response.persons) {
          const person = response.persons[key];
          console.log(key + ': ' + person);
          str = str + person.ID + ' ' + person.Name + ' ' + person.Children + ' ' + person.Invitationstatus + ' ';
        }
        li.textContent = str + '\n' + JSON.stringify(response);
      } catch (error) {
        console.log(error);
      }
    };

    handleFormData();
  });
};
