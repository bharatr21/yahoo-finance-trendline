document.addEventListener("DOMContentLoaded", async () => {
    const ctx = document.getElementById("stockChart").getContext("2d");
    const stockSelector = document.getElementById("stockSelector");
    const timeRangeSelector = document.getElementById("timeRangeSelector");

    // Initialize Chart.js with placeholder data
    const stockChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Stock Price ($)",
                data: [],
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Price ($)" } }
            }
        }
    });

    // Function to update the chart with new data
    function updateChart(data) {
        stockChart.data.labels = data.labels;
        stockChart.data.datasets[0].data = data.prices;
        stockChart.update();
    }

    // Fetch available stocks for dropdown
    async function loadStockOptions() {
        try {
            const response = await fetch("/api/stocks");
            const data = await response.json();
            stockSelector.innerHTML = ""; // Clear previous options

            data.stocks.forEach(stock => {
                let option = document.createElement("option");
                option.value = stock.symbol;
                option.textContent = `${stock.name} (${stock.symbol})`;
                stockSelector.appendChild(option);
            });

            // Load default stock data (first stock in list)
            if (data.stocks.length > 0) {
                fetchStockData(data.stocks[0].symbol, timeRangeSelector.value);
            }
        } catch (error) {
            console.error("Error loading stocks:", error);
            stockSelector.innerHTML = `<option value="">Error loading stocks</option>`;
        }
    }

    // Fetch stock data from API
    async function fetchStockData(symbol, range) {
        try {
            const response = await fetch(`/api/stock-data?symbol=${symbol}&range=${range}`);
            const data = await response.json();
            updateChart(data);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    }

    // Fetch new stock data when stock or time range is changed
    function updateStockChart() {
        const selectedStock = stockSelector.value;
        const selectedRange = timeRangeSelector.value;
        if (selectedStock) {
            fetchStockData(selectedStock, selectedRange);
        }
    }

    stockSelector.addEventListener("change", updateStockChart);
    timeRangeSelector.addEventListener("change", updateStockChart);

    // Load stock options on startup
    loadStockOptions();
});
