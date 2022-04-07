const url = "http://18.193.250.181:1337";

const getData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log(data.data);
    if (data.data.length > 0) {
      return data.data;
    }
  } catch (err) {
    return console.log(err.message || "An error");
  }
};

// ----------------------------------------Displaying Checklist

const displayChecklist = async () => {
  const container = document.querySelector("form");
  container.innerHTML = "";
  const data = await getData(`${url}/api/activities`);
  // creating an element
  console.log(data);
  data.forEach((item) => {
    container.innerHTML += `
    <label for="${item.id}">
    <input type="checkbox" name="${Number(item.id)}" id="${item.id}" value="${
      item.attributes.title
    }" />${item.attributes.title}</label>
    `;
  });
  container.innerHTML += `
  <div class="line"></div>
  <button type="submit" class="button" id="next">Next</button>
  `;
  console.log(data);
};
displayChecklist();

// ------------------------Adding to Loacal Storage

const form = document.forms.add;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // pushing checked activities to LS
  const checkedActivities = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  const people = [];
  if (checkedActivities.length > 0) {
    checkedActivities.forEach((checkedActivity) => {
      const title = checkedActivity.id;
      people.push(title);
    });
    localStorage.setItem("people", people);
    // swapping between right side containers
    document.querySelector(".formContainer").classList.add("hidden");
    document.querySelector(".formContainer2").classList.remove("hidden");
  } else {
    alert("Please choose the activity!!!");
  }
});

// -------------------------------Selecting country (fetch get)

const selectCountry = document.querySelector("select");
const displayCountries = async () => {
  const data = await getData(`${url}/api/countries`);
  console.log(data);
  selectCountry.innerHTML = "";
  data.forEach((item) => {
    const option = document.createElement("option");
    option.id = item.id;
    option.value = item.attributes.country;
    option.textContent = item.attributes.country;
    selectCountry.append(option);
  });
};
displayCountries();

const postPersonData = async (personData) => {
  try {
    const res = await fetch(`${url}/api/people`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: personData }),
    });
    const data = await res.json();
    localStorage.setItem("personId", data.data.id);
    displayFetchData();
    console.log(data);
  } catch (err) {
    return console.log(err.message || "An error");
  }
};

const formDetails = document.forms.addPersonalData;

formDetails.addEventListener("submit", (e) => {
  e.preventDefault();

  const first_name = e.target.first_name.value.trim();
  const last_name = e.target.last_name.value.trim();
  const email = e.target.email.value.trim();
  let countryId = e.target.country.options[country.selectedIndex].id;
  countryId = countryId.slice(countryId.length - 1);

  const activities = localStorage.getItem("people").split(",");

  const personDataArray = {
    first_name,
    last_name,
    email,
    country: countryId,
    activities,
  };
  postPersonData(personDataArray);
  console.log(personDataArray);
  document.querySelector(".formContainer2").classList.add("hidden");
  document.querySelector(".formContainer3").classList.remove("hidden");
  alert("Data saved!");
});

// ----------------------------------Fetch pagal ID

const displayFetchData = async () => {
  const data = await getData(
    `${url}/api/people?populate=*&filters[id][$eq]=${localStorage.getItem(
      "personId"
    )}`
  );

  const firstName = document.getElementById("firstname");
  const addName = document.createElement("p");
  addName.textContent = data[0].attributes.first_name;
  firstName.append(addName);

  const lastName = document.getElementById("lastname");
  const addSurname = document.createElement("p");
  addSurname.textContent = data[0].attributes.last_name;
  lastName.append(addSurname);

  const email = document.getElementById("eemail");
  const addEmail = document.createElement("p");
  addEmail.textContent = data[0].attributes.email;
  email.append(addEmail);

  const country = document.getElementById("ccountry");
  const addCountry = document.createElement("p");
  addCountry.textContent = data[0].attributes.country.data.attributes.country;
  country.append(addCountry);
};

// ----------------------------------Approve or reject butttons

const deleteButton = async (personId) => {
  console.log(personId);
  try {
    const res = await fetch(`${url}/api/people/${personId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    alert(err);
  }
};

const approveBtn = document.getElementById("approve");
approveBtn.addEventListener("click", () => {
  document.querySelector(".formContainer3").classList.add("hidden");
  document.querySelector(".formContainer4").classList.remove("hidden");
});

const rejectBtn = document.getElementById("reject");
rejectBtn.addEventListener("click", () => {
  deleteButton(localStorage.getItem("personId"));
  document.querySelector(".formContainer3").classList.add("hidden");
  document.querySelector(".formContainer").classList.remove("hidden");
  alert("Account not created!");
});
