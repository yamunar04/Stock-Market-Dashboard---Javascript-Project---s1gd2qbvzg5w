const apiKey = '82XBFOXIB2L938R9';
const apiUrl = 'https://www.alphavantage.co/query';

async function fetchStockData(symbol, timeFrame) {
    try {
        const url = `${apiUrl}?function=TIME_SERIES_${timeFrame}&symbol=${symbol}&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        let dataArr = Object.entries(data);
        renderCard(dataArr[1],symbol,timeFrame);
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

function renderCard(stock,symbol,timeFrame) {
    console.log(stock);
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerHTML = `
        <div class="stock-symbol">${symbol.toUpperCase()}</div>
        <div>${timeFrame.toLowerCase()}</div>
        <button class="delete-button">Delete</button>`;

    cardContainer.appendChild(card);
    const stockSymbol = card.querySelector('.stock-symbol');
    stockSymbol.addEventListener('click', () => showStockData(stock,symbol,timeFrame));

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent card click event from firing
        deleteCard(symbol);
    });
}

function deleteCard(symbol) {
    const cardContainer = document.getElementById('card-container');
    const card = cardContainer.querySelector(`[data-symbol="${symbol}"]`);
    if (card !== null) {
        card.remove();
    }
}

function showStockData(stock,symbol,timeFrame) {
    console.log(stock);
    const modalContainer = document.getElementById('modal-container');
    const modal = document.getElementById('modal');
    modal.classList.add('active');

    const header = document.createElement('h2');
    header.innerText = symbol.toUpperCase()+" - "+timeFrame.toLowerCase();
    modalContainer.style.display = "block";

    const modalTable = document.createElement('div');
    modalTable.classList.add('modal-table');

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    const headers = ['Open', 'High', 'Low', 'Close','Date'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.innerText = headerText;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    const timeFrameData = Object.entries(stock[1]).slice(0, 10);
    console.log(timeFrameData);
    
    timeFrameData.forEach(([date, dataSet]) => {
        const row = document.createElement('tr');

        const fields = ['1. open', '2. high', '3. low', '4. close'];

        fields.forEach(field => {
            const td = document.createElement('td');
            td.innerText = dataSet[field];
            row.appendChild(td);
        });

        const dateCell = document.createElement('td');
        dateCell.innerText = date;
        row.appendChild(dateCell);

        table.appendChild(row);
    });

    modal.innerHTML = '';
    modal.appendChild(header);
    modal.appendChild(modalTable);
    modalTable.appendChild(table);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', (event) => {
        modalContainer.style.display = "none";
        event.stopPropagation();
    });
    modal.appendChild(closeButton);
}

function addStockToWatchlist() {
    const symbol = document.getElementById('symbolInput').value;
    const timeFrame = document.getElementById('timeOptions').value;
    fetchStockData(symbol, timeFrame)
}

document.getElementById('addStockBtn').addEventListener('click', addStockToWatchlist);
