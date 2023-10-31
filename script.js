const apiKey = 'AXG6NJXXDIDHEXDZ';
const apiUrl = "https://www.alphavantage.co/query";

document.getElementById("addStockBtn").addEventListener("click", addStockToWatchlist);

function addStockToWatchlist() {
  const symbol = document.getElementById("symbolInput").value;
  const timeFrame = document.getElementById("timeOptions").value;
  if(symbol)
  {
    fetchStockData(symbol, timeFrame);
  }
  else{
    alert('Enter Symbol');
  }
}


async function fetchStockData(symbol, timeFrame) {
  try {
    const url = `${apiUrl}?function=TIME_SERIES_${timeFrame}&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("fetchedData: ", data);
    let dataArr = Object.entries(data);
    console.log("dataArr: ", dataArr);
    console.log("dataArr[1]: ", dataArr[1]);
    renderCard(dataArr[1], symbol, timeFrame);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const cardContainer = document.getElementById("card-container");

function renderCard(stock, symbol, timeFrame) {
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

  cardContainer.appendChild(card);

  const stockSymbol = card.querySelector(".stock-symbol");
  stockSymbol.addEventListener("click", (event) => {
    event.stopPropagation();
    showStockData(stock, symbol, timeFrame);
  });


  const deleteButton = card.querySelector(".delete-button");
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation(); 
    deleteCard(symbol);
  });
}
function deleteCard(symbol) {
  const card = cardContainer.querySelector(`[data-symbol="${symbol}"]`);
  if (card !== null) {
    card.remove();
  }
}

function showStockData(stock, symbol, timeFrame) {
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

  const header = document.createElement("h2");
  modalContainer.style.display = "block";

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");

  const headers = ["Date", "Open", "High", "Low", "Close", "Volume"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.innerText = headerText;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  const timeFrameData = Object.entries(stock[1]).slice(0, 10);
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