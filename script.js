const BASE_URL = "https://swapi.dev/api/";
async function baseData() {
  let rawData = fetch(BASE_URL)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    });
}
baseData();
//all HTML elements
let idNum1 = document.getElementById("ID-result1");
let idNum2 = document.getElementById("ID-result2");
let idNum3 = document.getElementById("ID-result3");
let idNum4 = document.getElementById("ID-result4");
let header1 = document.getElementById("header-1");
let header2 = document.getElementById("header-2");
let header3 = document.getElementById("header-3");
let header4 = document.getElementById("header-4");
let changeStyle = document.getElementById("table");
let firstID = document.getElementById("ID-result1");
let firstInfo1 = document.getElementById("first-info1");
let secondInfo1 = document.getElementById("second-info1");
let thirdInfo1 = document.getElementById("third-info1");
let fourthInfo1 = document.getElementById("fourth-info1");
let secondID = document.getElementById("ID-result2");
let firstInfo2 = document.getElementById("first-info2");
let secondInfo2 = document.getElementById("second-info2");
let thirdInfo2 = document.getElementById("third-info2");
let fourthInfo2 = document.getElementById("fourth-info2");
let thirdID = document.getElementById("ID-result3");
let firstInfo3 = document.getElementById("first-info3");
let secondInfo3 = document.getElementById("second-info3");
let thirdInfo3 = document.getElementById("third-info3");
let fourthInfo3 = document.getElementById("fourth-info3");
let fourthID = document.getElementById("ID-result4");
let firstInfo4 = document.getElementById("first-info4");
let secondInfo4 = document.getElementById("second-info4");
let thirdInfo4 = document.getElementById("third-info4");
let fourthInfo4 = document.getElementById("fourth-info4");
let allPagesDiv = document.getElementById("all-pages");
let presentPageDiv = document.getElementById("present-page-button");
let nextButton = document.getElementById("next-button");
let prevButton = document.getElementById("prev-button");
let plusTenButton = document.getElementById("plus-ten");
let date1 = document.getElementById("date1");
let date2 = document.getElementById("date2");
let date3 = document.getElementById("date3");
let date4 = document.getElementById("date4");
let action1 = document.getElementById("actions1");
let action2 = document.getElementById("actions2");
let action3 = document.getElementById("actions3");
let action4 = document.getElementById("actions4");

//default settings
let presentPage = 1;
updateID(1);

function updatePresentPage(action, maxPage) {
  if (action == "next") {
    presentPage++;
  } else if (action == "prev") {
    presentPage--;
  } else if (action == "plusTen") {
    presentPage += 10;
  }
  if (presentPage > maxPage) {
    presentPage = maxPage;
  }
  if (presentPage < 1) {
    presentPage = 1;
  }
  presentPageDiv.placeholder = presentPage;
}

function updateID(page) {
  firstID.textContent = 1 + 4 * (page - 1);
  secondID.textContent = 2 + 4 * (page - 1);
  thirdID.textContent = 3 + 4 * (page - 1);
  fourthID.textContent = 4 + 4 * (page - 1);
}

let i = 1;
async function buttons() {
  let num = 1;
  let info = [];
  let used;
  const buttons = document.getElementById("buttons");
  let rawData = fetch(BASE_URL);
  let keys = (await rawData).json().then((response) => {
    const headers = Object.keys(response);
    for (let key of headers) {
      let button = document.createElement("button");
      button.innerHTML = key;
      button.className = "button";
      button.id = `button-${num}`;
      buttons.appendChild(button);
      num++;

      async function getInfo() {
        let data = fetch(`${BASE_URL}${key}`)
          .then((response) => response.json())
          .then((response) => {
            let allPages = Math.ceil(response.count / 4);
            info.push([key, allPages]);
          });
      }

      getInfo();
      const length = info.length;
      button.addEventListener("click", async function () {
        updateID(1);
        changeStyle.style.display = "flex";
        let data = fetch(`${BASE_URL}${key}`)
          .then((response) => response.json())
          .then((response) => {
            let allPages = Math.ceil(response.count / 4);
            allPagesDiv.innerHTML = `of ${allPages}`;
            presentPage = 1;
            presentPageDiv.placeholder = presentPage;
            used = key;
            fillTable(checkPages(1));
          });
      });
    }

    function checkPages(choice) {
      return info
        .filter((header) => {
          return header[0] == used;
        })
        .map((header) => {
          if (choice == 1) {
            return header[0];
          } else return header[1];
        });
    }

    nextButton.addEventListener("click", function () {
      updatePresentPage("next", checkPages());
      updateID(presentPage);
      fillTable(checkPages(1));
    });
    prevButton.addEventListener("click", function () {
      updatePresentPage("prev", checkPages());
      updateID(presentPage);
      fillTable(checkPages(1));
    });
    plusTenButton.addEventListener("click", function () {
      updatePresentPage("plusTen", checkPages());
      updateID(presentPage);
      fillTable(checkPages(1));
    });
  });
}
buttons();

async function fillTable(header) {
  let arr = [];
  let data = fetch(`${BASE_URL}${header}`)
    .then((response) => response.json())
    .then((response) => {
      let allResults = response.count;
      let allRepeat = Math.ceil(allResults / 10);
      let allPages = Math.ceil(response.count / 4);
      let rest = allPages * 4 - allResults;
      for (let i = 1; i <= allRepeat; i++) {
        let data = fetch(`${BASE_URL}${header}/?page=${i}`)
          .then((response) => response.json())
          .then((response) => {
            response.results.map((result) => {
              let headers = Object.keys(response.results[0]);
              let newResult;

              if (header == "people") {
                header1.textContent = headers[0];
                header2.textContent = headers[1];
                header3.textContent = headers[2];
                header4.textContent = headers[9];

                newResult = new People(
                  result.name,
                  result.height,
                  result.mass,
                  result.created,
                  result.films.length
                );
              } else if (header == "planets") {
                header1.textContent = headers[0];
                header2.textContent = headers[4];
                header3.textContent = headers[5];
                header4.textContent = headers[8];

                newResult = new Planet(
                  result.name,
                  result.climate,
                  result.gravity,
                  result.population,
                  result.created
                );
              } else if (header == "films") {
                header1.textContent = headers[0];
                header2.textContent = headers[3];
                header3.textContent = headers[4];
                header4.textContent =
                  headers[5].substring(0, 7) + " " + headers[5].substring(8);

                newResult = new Film(
                  result.title,
                  result.director,
                  result.release_date,
                  result.producer,
                  result.created
                );
              } else if (header == "species") {
                header1.textContent = headers[0];
                header2.textContent =
                  headers[3].substring(0, 7) + " " + headers[3].substring(8);
                header3.textContent =
                  headers[7].substring(0, 7) + " " + headers[7].substring(8);
                header4.textContent = headers[9];

                newResult = new Species(
                  result.name,
                  result.average_height,
                  result.average_lifespan,
                  result.language,
                  result.created
                );
              } else {
                header1.textContent = headers[0];
                header2.textContent = headers[1];
                header3.textContent = headers[2];
                header4.textContent = headers[7];

                newResult = new Machine(
                  result.name,
                  result.model,
                  result.manufacturer,
                  result.created,
                  result.crew
                );
              }
              arr.push(newResult);
            });
          })
          .then(() => {
            //leaving empty table row

            let index = 4 * presentPage - 4;
            if (presentPage == allPages) {
              if (rest >= 1) {
                idNum4.textContent = null;
                firstInfo4.textContent = null;
                secondInfo4.textContent = null;
                thirdInfo4.textContent = null;
                fourthInfo4.textContent = null;
                date4.textContent = null;
                action4.textContent = null;
                if (rest >= 2) {
                  idNum3.textContent = null;
                  firstInfo3.textContent = null;
                  secondInfo3.textContent = null;
                  thirdInfo3.textContent = null;
                  fourthInfo3.textContent = null;
                  date3.textContent = null;
                  action3.textContent = null;
                  if (rest >= 3) {
                    idNum2.textContent = null;
                    firstInfo2.textContent = null;
                    secondInfo2.textContent = null;
                    thirdInfo2.textContent = null;
                    fourthInfo2.textContent = null;
                    date2.textContent = null;
                    action2.textContent = null;
                  }
                }
                return;
              }
            }

            firstInfo1.textContent = arr[index].firstInfo;
            secondInfo1.textContent = arr[index].secondInfo;
            thirdInfo1.textContent = arr[index].thirdInfo;
            fourthInfo1.textContent = arr[index].fourthInfo;

            firstInfo2.textContent = arr[index + 1].firstInfo;
            secondInfo2.textContent = arr[index + 1].secondInfo;
            thirdInfo2.textContent = arr[index + 1].thirdInfo;
            fourthInfo2.textContent = arr[index + 1].fourthInfo;

            firstInfo3.textContent = arr[index + 2].firstInfo;
            secondInfo3.textContent = arr[index + 2].secondInfo;
            thirdInfo3.textContent = arr[index + 2].thirdInfo;
            fourthInfo3.textContent = arr[index + 2].fourthInfo;

            firstInfo4.textContent = arr[index + 3].firstInfo;
            secondInfo4.textContent = arr[index + 3].secondInfo;
            thirdInfo4.textContent = arr[index + 3].thirdInfo;
            fourthInfo4.textContent = arr[index + 3].fourthInfo;

            date1.textContent =
              arr[index].fifthInfo.substring(8, 10) +
              "-" +
              arr[index].fifthInfo.substring(5, 7) +
              "-" +
              arr[index].fifthInfo.substring(0, 4);

            date2.textContent =
              arr[index + 1].fifthInfo.substring(8, 10) +
              "-" +
              arr[index + 1].fifthInfo.substring(5, 7) +
              "-" +
              arr[index + 1].fifthInfo.substring(0, 4);

            date3.textContent =
              arr[index + 2].fifthInfo.substring(8, 10) +
              "-" +
              arr[index + 2].fifthInfo.substring(5, 7) +
              "-" +
              arr[index + 2].fifthInfo.substring(0, 4);

            date4.textContent =
              arr[index + 3].fifthInfo.substring(8, 10) +
              "-" +
              arr[index + 3].fifthInfo.substring(5, 7) +
              "-" +
              arr[index + 3].fifthInfo.substring(0, 4);
          });
      }
    });
}

//change page by typing
presentPageDiv.addEventListener("input", updatePage);
function updatePage(e) {
  presentPage = e.target.value;
  updateID(presentPage);
  fillTable(checkPages(1));
}

//classes
class Base {
  constructor(name, created) {
    this.firstInfo = name;
    this.fifthInfo = created;
  }
}

class Machine extends Base {
  constructor(model, manufacturer, name, created, passengers) {
    super(name, created);
    this.secondInfo = model;
    this.thirdInfo = manufacturer;
    this.fourthInfo = passengers;
  }
}

class People extends Base {
  constructor(name, height, mass, created, howManyFilms) {
    super(name, created);
    this.secondInfo = height;
    this.thirdInfo = mass;
    this.fourthInfo = howManyFilms;
  }
}

class Planet extends Base {
  constructor(name, climate, population, gravity, created) {
    super(name, created);
    this.secondInfo = climate;
    this.thirdInfo = population;
    this.fourthInfo = gravity;
  }
}

class Film extends Base {
  constructor(name, director, producer, release_date, created) {
    super(name, created);
    this.secondInfo = director;
    this.thirdInfo = release_date;
    this.fourthInfo = producer;
  }
}
class Species extends Base {
  constructor(name, average_height, average_lifespan, language, created) {
    super(name, created);
    this.secondInfo = average_height;
    this.thirdInfo = average_lifespan;
    this.fourthInfo = language;
  }
}
