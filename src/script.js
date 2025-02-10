document.addEventListener("DOMContentLoaded", async () => {
  const ctx = document.getElementById("stockChart").getContext("2d");
  const stockSelector = document.getElementById("stockSelector");
  const timeRangeSelector = document.getElementById("timeRangeSelector");

  // Initialize Chart.js with placeholder data
  const stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Stock Price ($)",
          data: [],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Price ($)" } },
      },
    },
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
      const response = await fetch(
        "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-summary",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "",
            "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();
      stockSelector.innerHTML = ""; // Clear previous options

      console.log(data);

      data.marketSummaryAndSparkResponse.result.forEach((market) => {
        let option = document.createElement("option");
        option.value = market.symbol;
        option.textContent = `${market.shortName} (${market.symbol})`;
        stockSelector.appendChild(option);
      });

      // Load default stock data (first stock in list)
      if (data.marketSummaryAndSparkResponse.result.length > 0) {
        console.log(timeRangeSelector.value);
        fetchStockData(
          data.marketSummaryAndSparkResponse.result[0].symbol,
          "1d",
          timeRangeSelector.value
        );
      }
    } catch (error) {
      console.error("Error loading stocks:", error);
      stockSelector.innerHTML = `<option value="">Error loading stocks</option>`;
    }
  }

  // Fetch stock data from API
  async function fetchStockData(symbol, interval = "2m", range = "1mo") {
    if (range == "1d") {
      interval = "10m";
    }
    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?symbol=${symbol}&interval=${interval}&range=${range}&region=US`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.chart && data.chart.result && data.chart.result.length > 0) {
        const chartData = data.chart.result[0];
        const timestamps = chartData.timestamp.map((ts) =>
          new Date(ts * 1000).toLocaleTimeString()
        );
        const prices = chartData.indicators.quote[0].close;

        updateChart({ labels: timestamps, prices });
      } else {
        console.error("Invalid data received", data);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }

  // Fetch new stock data when stock or time range is changed
  function updateStockChart() {
    const selectedStock = stockSelector.value;
    const selectedRange = timeRangeSelector.value;
    if (selectedStock) {
      fetchStockData(selectedStock, "1d", selectedRange);
    }
  }

  stockSelector.addEventListener("change", updateStockChart);
  timeRangeSelector.addEventListener("change", updateStockChart);

  // Load stock options on startup
  loadStockOptions();
});
