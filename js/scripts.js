/**
 * Estado da aplicação (state)
 */

let inputSearch = null;
let buttonSearch = null;

let tabUsers = null;
let usersTitle = null;
let usersFound = 0;
let usersList = [];

let tabStatistics = null;
let statisticsTitle = null;
let male = 0;
let female = 0;
let sumAge = 0;
let avgAge = 0;

let filteredUsers = [];

let numberFormat = null;

window.addEventListener('load', () => {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('#buttonSearch');

  tabUsers = document.querySelector('.tabUsers');
  usersTitle = document.querySelector('#usersTitle');
  usersFound = document.querySelector('#usersFound');
  usersList = document.querySelector('.usersList');

  tabStatistics = document.querySelector('.tabStatistics');
  statisticsTitle = document.querySelector('#statisticsTitle');
  male = document.querySelector('#male');
  female = document.querySelector('#female');
  sumAge = document.querySelector('#sumAge');
  avgAge = document.querySelector('#avgAge');

  numberFormat = Intl.NumberFormat('pt-BR');

  inputSearch.addEventListener('keyup', renderUser);

  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsers = json.results.map((person) => {
    const { name, picture, dob, gender } = person;
    return {
      firstName: name.first,
      lastName: name.last,
      picture: picture.medium,
      age: dob.age,
      gender: gender,
    };
  }).sort((a, b) => {
    return a.firstName.localeCompare(b.firstName); //ordem alfabética
  });




  render();

}

function render() {
  renderUserList();
  renderStatistics();
  renderMale();
  renderFemale();
  renderAge();
  renderAvg();
}

function renderUserList() {
  let usersFound = filteredUsers.length;

  let usersHTML = `
    <div>
    <h3 id="usersTitle">
      <span id="usersFound">${usersFound}</span> 
      usuário(s) encontrado(s).
    </h3>
  `;


  filteredUsers.forEach((person) => {
    const { firstName, lastName, picture, age } = person;

    const personHTML = `
    <div class="users">
      <div>
        <img src="${picture}" alt="${firstName} ${lastName}" />
      </div>
      <div>
        <p>${firstName} ${lastName},&nbsp</p>
      </div>
      <div>
        <p>${age} anos.</p>
      </div>
    </div>
    `;

    usersHTML += personHTML;
  });

  usersHTML += '</div>';
  tabUsers.innerHTML = usersHTML;

}

function renderStatistics() {
  if (allUsers.length > 0) {
    let statisticHTML = `Estatísticas`;
    statisticsTitle.innerHTML = statisticHTML;
  }

}

function renderMale() {
  const numbMale = filteredUsers.filter(person => {
    return person.gender === "male";
  });

  male.textContent = numbMale.length;
}

function renderFemale() {
  const numbFemale = filteredUsers.filter(person => {
    return person.gender === "female";
  });

  female.textContent = numbFemale.length;
}

function renderAge() {
  const totalAges = filteredUsers.reduce((acc, cur) => {
    return acc + cur.age;
  }, 0);

  sumAge.textContent = totalAges;
}

function renderAvg() {
  console.log(filteredUsers.length);
  if (filteredUsers.length > 0) {
    avgAge.textContent = sumAge.textContent / filteredUsers.length;
  } else {
    avgAge.textContent = 0;
  }
}


function cleanString(str) {
  return str.toLowerCase();
  //.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}


function renderUser() {
  const search = allUsers.filter(person => {
    return cleanString(person.firstName).includes(cleanString(inputSearch.value)) || cleanString(person.lastName).includes(cleanString(inputSearch.value));
  });

  filteredUsers = search;

  render();
}