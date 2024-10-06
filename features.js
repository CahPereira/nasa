
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgJAElA3fsD-bZ-LXMVJpGd_4cbglLV2U",
    databaseURL:  "https://stellarfarmers-a849d-default-rtdb.firebaseio.com",
    
}


// Get the current URL's query parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the 'address' parameter from the URL
const address = urlParams.get('address');
console.log(address);

if (address) {
    document.getElementById('addressContainer').textContent = `Address: ${address}`;
    
}

// Your Google API key
const googleApiKey = "AIzaSyDgJAElA3fsD-bZ-LXMVJpGd_4cbglLV2U";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 1. Placeholder function to get FIPS code from an address (normally an API call)
function getFIPSFromAddress(address) {
  console.log(`Looking up FIPS code for address: ${address}`);
  
  // Simulating an API call and FIPS code retrieval
  const simulatedFIPS = '06077';  // Replace this with actual logic to get FIPS
  console.log(`FIPS code found: ${simulatedFIPS}`);
  
  return Promise.resolve(simulatedFIPS);
}

// 2. Function to get data for a crop in a specific year using the FIPS code
function getCropDataForYear(fipsCode, crop, year) {
  console.log(`Retrieving data for FIPS: ${fipsCode}, Crop: ${crop}, Year: ${year}`);
  
  const cropYearRef = ref(database, `${fipsCode}/${crop}/${year}`);
  
  get(cropYearRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log(`Data for ${crop} in ${year} under FIPS ${fipsCode}:`, data);
      processAndVisualizeData(data, year, crop);  // Process and visualize data
    } else {
      console.log(`No data available for ${crop} in ${year} under FIPS ${fipsCode}`);
    }
  }).catch((error) => {
    console.error("Error retrieving data:", error);
  });
}

// 3. Process the data and extract values for visualization
function processAndVisualizeData(data, year, crop) {
  console.log(`Processing data for ${crop} in ${year}`);
  
  const months = Object.keys(data);
  const avgTemperatures = [];
  const revenues = [];

  months.forEach(month => {
    const monthData = data[month][0];  // Access data for that month
    avgTemperatures.push(monthData['Avg Temperature (K)']);
    revenues.push(monthData['Revenue']);
  });

  console.log("Average Temperatures:", avgTemperatures);
  console.log("Revenues:", revenues);

  // Call the function to visualize data on a graph
  displayGraph(avgTemperatures, revenues, months, year, crop);
}

// 4. Visualize the data using Chart.js
function displayGraph(temperatures, revenues, months, year, crop) {
  console.log(`Visualizing data for ${crop} in ${year}...`);

  const ctx = document.getElementById('cropPerformanceChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,  // Months as labels
      datasets: [{
        label: 'Average Temperature (K)',
        data: temperatures,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false
      },
      {
        label: 'Revenue',
        data: revenues,
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: `${crop} Performance in ${year}`
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Values'
          }
        }
      }
    }
  });
  console.log("Graph displayed successfully.");
}

// 5. Main function to tie everything together
function startProcess(address, crop, year) {
  console.log("Starting process...");

  // Step 1: Get the FIPS code from the address
  getFIPSFromAddress(address).then(fipsCode => {
    // Step 2: Use FIPS code to retrieve data from Firebase
    getCropDataForYear(fipsCode, crop, year);
  });
}

// Example: Call this function with the address, crop, and year you want to query
// Address passed over from the hero page
startProcess(address, "Corn", "2022");
