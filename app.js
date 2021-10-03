const searchBox = document.querySelector(".search-box");
const containerOutput = document.querySelector(".container");
const modal = document.querySelector(".modal");

let cityAndState = [];
let searchQuery = "";
let selected = {};

const changeTextBgr = (word) => {
  if (searchQuery === "") {
    return word;
  } else {
    let result = word.replace(
      RegExp(searchQuery, "gi"),
      `<span class="orange">${searchQuery}</span>`
    );
    return result;
  }
};

const populationFormat = (num) => {
  const number = parseInt(num);
  return number.toLocaleString();
};

const display = (data) => {
  if (data.length !== 0) {
    let output = data.map((city) => {
      return `
            <div class="card">
                <div class="overlay" data-detail="${encodeURIComponent(
                  JSON.stringify(city)
                )}"></div>
                <ul>
                    <li class="city"><h1>City: ${changeTextBgr(
                      city.city
                    )}</h1></li>
                    <li class="state">State: ${changeTextBgr(city.state)}</li>
                    <li class="population">Population: ${populationFormat(
                      city.population
                    )}</li>
                    <li class="growth">Growth: <span class="${
                      parseInt(city.growth_from_2000_to_2013.slice(0, -1)) >= 0
                        ? "green"
                        : "red"
                    }">${city.growth_from_2000_to_2013} </span></li>
                </ul>
            </div>`;
    });

    containerOutput.innerHTML = output.join("");
  } else {
    containerOutput.innerHTML =
      "<h1 class='red'>Oops!! No such city or state found please try anather city or state name</h1>";
  }
};

const changeClassModal = () => {
  modal.classList.toggle("hidden");
};

const selectedCity = () => {
  changeClassModal();
  document.querySelector(
    ".modal .city"
  ).innerHTML = `<h1>City: ${selected.city}</h1>`;
  document.querySelector(".modal .rank").innerHTML = `Rank: ${selected.rank}`;
  document.querySelector(
    ".modal .state"
  ).innerHTML = `state: ${selected.state}`;
  document.querySelector(
    ".modal .population"
  ).innerHTML = `Population: ${populationFormat(selected.population)}`;
  document.querySelector(".modal .growth").innerHTML = `Growth: <span class="${
    parseInt(selected.growth_from_2000_to_2013.slice(0, -1)) >= 0
      ? "green"
      : "red"
  }"> ${selected.growth_from_2000_to_2013}</span>`;
  document.querySelector(
    ".modal .coordinates"
  ).innerHTML = `Coordinate: Latitude ${selected.latitude}, Longitude ${selected.longitude}`;
};
const inputValidator = (str) => {
  if (!str.match(/^[a-zA-Z() ]+$/)) {
    const err = "not a string";
    console.log(err);
    return err;
  } else {
    let myString = str.replace(/^\s+|\s+$/gm, " ");
    return myString;
  }
};

const fetchData = () => {
  fetch(
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
  )
    .then((res) => res.json())
    .then((data) => {
      cityAndState = data;
      display(cityAndState);
    })
    .catch((err) => {
      console.log(err);
    });
};
fetchData();

searchBox.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;
  if (inputValue === "") {
    fetchData();
  }

  searchQuery = inputValidator(inputValue);

  if (searchQuery === "not a string") {
    containerOutput.innerHTML =
      "<h1 class='red'>Oops!! number and symbols is not allowed,<br/>please try string to search city or state</h1>";
  } else {
    const newValue = cityAndState.filter((myCity) => {
      const city = myCity.city.toLowerCase();
      const state = myCity.state.toLowerCase();
      return (
        city.includes(searchQuery.toLowerCase()) ||
        state.includes(searchQuery.toLowerCase())
      );
    });

    display(newValue);
  }
});

containerOutput.addEventListener("click", (e) => {
  if (!e.target.classList.contains("overlay")) return;

  let clicked = e.target.getAttribute("data-detail");
  selected = JSON.parse(decodeURIComponent(clicked));
  selectedCity();
});

modal.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal") ||
    e.target.classList.contains("close-btn")
  ) {
    changeClassModal();
  }
});
