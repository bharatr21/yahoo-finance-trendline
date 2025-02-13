document.addEventListener("DOMContentLoaded", async () => {
  const ctx = document.getElementById("stockChart").getContext("2d");
  const stockSelector = document.getElementById("stockSelector");
  const timeRangeSelector = document.getElementById("timeRangeSelector");

  // Initialize Chart.js with placeholder data

  //TO DO: Code the stockChart object (line chart) with the following options: type, data, options
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
        y: { title: { display: true, text: "Price ($)" }, 
            //  beginAtZero: true  COMMENTED IT OUT BECAUSE IT DOESNT SHOW CHANGES IN PRICE CLEARLY
           },
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
      // Fetch stock data from API with options and headers and scrape the response {TO DO}

      stockSelector.innerHTML = ""; // Clear previous options

      /*
      console.log("Stock data from API:", data); // shows the data from the API
      console.log("Data.marketSummaryAndSparkResponse from API:", data.marketSummaryAndSparkResponse); // shows the data.marketSummaryAndSparkResponse from the API (1 level deep)
      console.log("Data.marketSummaryAndSparkResponse.result from API:", data.marketSummaryAndSparkResponse.result); // shows the data.marketSummaryAndSparkResponse.result from the API (2 levels deep)
      */

      // TO DO: Loop through the data.marketSummaryAndSparkResponse.result array and add each stock as an option in the dropdown
      

      // TO DO: Load the default stock data for the first stock in the chart below

    } catch (error) {
      console.error("Error loading stocks:", error);
      stockSelector.innerHTML = `<option value="">Error loading stocks</option>`;
    }
  }

  // Fetch stock data from API
  // TO DO: Add suitable arguments for the function
  async function fetchStockData() {
    if (range == "1d") {
      interval = "10m";
    }
    // TO DO: URL to fetch stock data from API and add options and headers

    try {
      // const response = await fetch(url, options);
      
      // const data = await response.json();
      // console.log("Raw response from API:", data); // shows the raw data from the API
      // console.log("Data.chart from API:", data.chart); // shows the data.chart from the API (1 level deep)
      // console.log("Data.chart.result from API:", data.chart.result); // shows the data.chart.result from the API (2 levels deep)
      // console.log("Data.chart.result[0] from API:", data.chart.result[0]); // shows the data.chart.result[0] from the API (3 levels deep)


      // if (data.chart && data.chart.result && data.chart.result.length > 0) {
      //   const chartData = data.chart.result[0];
      //   let timestamps;
        
      //   if (range === "1d") {
      //     timestamps = chartData.timestamp.map((ts) =>
      //       new Date(ts * 1000).toLocaleTimeString()
      //     );
      //   } else {
      //     timestamps = chartData.timestamp.map((ts) =>
      //       new Date(ts * 1000).toLocaleDateString()
      //     );
      //   }
      //   console.log(timestamps);
      //   const prices = chartData.indicators.quote[0].close;

      //   updateChart({ labels: timestamps, prices });
      // } else {
      //   console.error("Invalid data received", data);
      // }
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
