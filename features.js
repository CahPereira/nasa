import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDgJAElA3fsD-bZ-LXMVJpGd_4cbglLV2U",
    databaseURL: "https://stellarfarmers-a849d-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function getFIPSFromAddress(address) {
    console.log(`Looking up FIPS code for address: ${address}`);
    // Simulating an API call and FIPS code retrieval
    return Promise.resolve('06077');
}

function initializeDashboard(monthlyData) {
    const dashboard = document.getElementById('dashboard');
    const graphContainer = document.getElementById('graphContainer');
    const graphCanvas = document.getElementById('graphCanvas');
    let chart;

    function createCard(title, value) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">${title}</div>
            <div class="card-value">${value}</div>
        `;
        card.addEventListener('click', () => showGraph(title));
        return card;
    }

    function calculateAverage(key) {
        return (monthlyData.reduce((sum, month) => sum + month[key], 0) / monthlyData.length).toFixed(2);
    }

    function calculateTotal(key) {
        return monthlyData.reduce((sum, month) => sum + month[key], 0).toLocaleString();
    }

    const cardData = [
        { title: 'Avg Temperature', value: `${calculateAverage('avgTemp')} K` },
        { title: 'Avg Wind Speed', value: `${calculateAverage('windSpeed')} m/s` },
        { title: 'Avg Wind Gust', value: `${calculateAverage('windGust')} m/s` },
        { title: 'Total Revenue', value: `$${calculateTotal('revenue')}` },
        { title: 'Total Seed Cost', value: `$${calculateTotal('seedCost')}` },
        { title: 'Total Fertilizer Cost', value: `$${calculateTotal('fertilizerCost')}` },
    ];

    dashboard.innerHTML = '';
    cardData.forEach(card => dashboard.appendChild(createCard(card.title, card.value)));

    function showGraph(title) {
        graphContainer.style.display = 'block';
        const ctx = graphCanvas.getContext('2d');
        
        if (chart) chart.destroy();

        const key = title.split(' ')[1].toLowerCase();
        
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [{
                    label: title,
                    data: monthlyData.map(d => d[key]),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Monthly ${title}`
                    }
                }
            }
        });
    }
}

function getCropDataForYear(fipsCode, crop, year) {
    console.log(`Retrieving data for FIPS: ${fipsCode}, Crop: ${crop}, Year: ${year}`);
    
    const cropYearRef = ref(database, `${fipsCode}/${crop}/${year}`);
    
    get(cropYearRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log(`Data for ${crop} in ${year} under FIPS ${fipsCode}:`, data);
            processAndVisualizeData(data, year, crop);
        } else {
            console.log(`No data available for ${crop} in ${year} under FIPS ${fipsCode}`);
        }
    }).catch((error) => {
        console.error("Error retrieving data:", error);
    });
}

function processAndVisualizeData(data, year, crop) {
    console.log(`Processing data for ${crop} in ${year}`);
    
    const monthlyData = Object.keys(data).map(month => {
        const monthData = data[month][0];
        return {
            month: month,
            avgTemp: monthData['Avg Temperature (K)'],
            revenue: parseInt(monthData['Revenue']),
            windSpeed: monthData['Wind Speed (m s**-1)'],
            windGust: monthData['Wind Gust (m s**-1)'],
            seedCost: parseInt(monthData['Seed Cost']),
            fertilizerCost: parseInt(monthData['Fertilizer Cost'])
        };
    });

    console.log("Processed Monthly Data:", monthlyData);
    initializeDashboard(monthlyData);
}

function startProcess(address, crop, year) {
    console.log("Starting process...");
    getFIPSFromAddress(address).then(fipsCode => {
        getCropDataForYear(fipsCode, crop, year);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const address = urlParams.get('address');
    
    if (address) {
        const addressContainer = document.getElementById('addressContainer');
        if (addressContainer) {
            addressContainer.textContent = `Address: ${address}`;
        }
        startProcess(address, "Corn", "2022");
    } else {
        console.error('No address provided in URL parameters');
    }
});