document.getElementById("renderBtn").addEventListener("click", fetchData);

var currentChart;

async function fetchData() {
  var countryCode = document.getElementById("country").value;
  const indicatorCode = "SP.POP.TOTL";
  //const indicatorCode = "SP.DYN.LE00.MA.IN";
  const baseUrl = "https://api.worldbank.org/v2/country/";
  const url =
    baseUrl + countryCode + "/indicator/" + indicatorCode + "?format=json&per_page=60";
  console.log("Fetching data from URL: " + url);

  var response = await fetch(url);

  if (response.status == 200) {
    var fetchedData = await response.json();
    //console.log(fetchedData);

    var data = getValues(fetchedData);
    var labels = getLabels(fetchedData);
    var countryName = getCountryName(fetchedData);
    addTitle(countryName);
    renderChart(data, labels, countryName);
  }
}

function getValues(data) {
  var vals = data[1].sort((a, b) => a.date - b.date).map((item) => item.value);
  return vals;
}

function getLabels(data) {
  var labels = data[1].sort((a, b) => a.date - b.date).map((item) => item.date);
  return labels;
}

function getCountryName(data) {
  var countryName = data[1][0].country.value;
  return countryName;
}

function addTitle(countryName) {
    var h = document.getElementById("countryName");
    var t = document.createTextNode(countryName);
    h.appendChild(t);
}

function renderChart(data, labels, countryName) {
  var ctx = document.getElementById("myChart").getContext("2d");

  if (currentChart) {
    // Clear the previous chart if it exists
    currentChart.destroy();
  }

  // Draw new chart
  currentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Population, " + countryName,
          data: data,
          borderColor: "#BF3F7F",
          backgroundColor: "#BF3F7F",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      animation: {
        duration: 10000
      }
    },
  });
}
