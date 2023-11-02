const API_KEY = 'AXG6NJXXDIDHEXDZ';
const API_URL = "https://www.alphavantage.co/query";
const cardContainer = document.getElementById("card-container");

document.getElementById("addStockBtn").addEventListener("click", addStockToWatchlist);

async function addStockToWatchlist() {
  const symbol = document.getElementById("symbolInput").value;
  const timeFrame = document.getElementById("timeOptions").value;
  if (symbol) {
    await fetchStockData(symbol, timeFrame);
    renderCard(dataArr[1], symbol, timeFrame);
  }
  else {
    alert('Enter Symbol');
  }
}

let dataArr = [];
async function fetchStockData(symbol, timeFrame) {
  try {
    const url = `${API_URL}?function=TIME_SERIES_${timeFrame}&symbol=${symbol}&interval=15min&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("fetchedData: ", data);
    dataArr = Object.entries(data);

  } catch (error) {
    console.error(error);
    throw error;
  }
}


function renderCard(stock, symbol, timeFrame) {
  console.log(stock);
  console.log(symbol, timeFrame);
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.symbol = symbol;
  card.dataset.cardName = `${symbol.toLowerCase()}-${timeFrame.toLowerCase()}`;
  card.innerHTML = `
        <div class="card-heading">
          <span class="stock-symbol">${symbol.toUpperCase()}</span>
          <span class="time-frame">${timeFrame.toUpperCase()}</span>
          <button class="delete-button"><i class="fa-regular fa-circle-xmark closeBtn"></i></button>
        </div>
        <div id="modal-container" class="modal-container">
                <div id="modal" class="modal"></div>
            </div> `;

  const stockSymbol = card.querySelector(".stock-symbol");
  stockSymbol.addEventListener("click", (event) => {
    event.stopPropagation();
    showStockData(stock, symbol, timeFrame);
  });

  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteCard(symbol, timeFrame);
  });

  cardContainer.appendChild(card);

}

function deleteCard(symbol, timeFrame) {
  const card = cardContainer.querySelector(`[data-card-name = "${symbol.toLowerCase()}-${timeFrame.toLowerCase()}"]`);
  if (card !== null) {
    card.remove();
  }
}

function showStockData(stock, symbol, timeFrame) {
  console.log(stock);

  const header = document.createElement("h2");
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  const timeFrameData = Object.entries(stock[1]).slice(0, 10);
  const headers = ["Date", "Open", "High", "Low", "Close", "Volume"];
  let cards = cardContainer.querySelectorAll(".card");
  cards = Array.from(cards);
  console.log("cards: ", cards);

  let selectedCard = cards.filter((card) => {
    return (
      card.getAttribute("data-card-name") ==
      `${symbol.toLowerCase()}-${timeFrame.toLowerCase()}`
    );
  });

  console.log("selectedCard: ", selectedCard[0]);
  console.dir(selectedCard[0].querySelector('.modal-container'));

  let modalContainer = selectedCard[0].querySelector('.modal-container');
  let modal = selectedCard[0].querySelector('.modal');

  console.log(modalContainer);
  console.log(modal);

  modalContainer.style.display = "block";


  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  console.log(timeFrameData);

  timeFrameData.forEach(([date, dataSet]) => {
    const row = document.createElement("tr");

    const fields = ["1. open", "2. high", "3. low", "4. close", "5. volume"];

    const dateCell = document.createElement("td");
    dateCell.innerText = date;
    row.appendChild(dateCell);

    fields.forEach((field) => {
      const td = document.createElement("td");
      td.innerText = dataSet[field];
      row.appendChild(td);
    });


    table.appendChild(row);
  });

  modal.innerHTML = "";
  modal.appendChild(header);
  modal.appendChild(table);

}