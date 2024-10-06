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

// Function to get coordinates from an address using Google Geocoding API
async function getCoordinates(address, apiKey) {
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const url = `${baseUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
        const response = await fetch(url);
        const data = await response.json();
  
        if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        } else {
            console.error("Geocoding failed:", data.status);
            return null;
        }
    } catch (error) {
        console.error("Error in getCoordinates:", error);
        return null;
    }
}

// Function to get FIPS code from coordinates using FCC's API
async function getFipsFromCoordinates(lat, lng) {
    const baseUrl = "https://geo.fcc.gov/api/census/block/find";
    const url = `${baseUrl}?latitude=${lat}&longitude=${lng}&format=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.County) {
            return data.County.FIPS;
        } else {
            console.error("FIPS code not found in response");
            return null;
        }
    } catch (error) {
        console.error("Error in getFipsFromCoordinates:", error);
        return null;
    }
}

// Combined function: Convert address to FIPS code
async function addressToFips(address, googleApiKey) {
    const coords = await getCoordinates(address, googleApiKey);
    if (coords) {
        const fips = await getFipsFromCoordinates(coords.lat, coords.lng);
        return fips;
    }
    return null;
}

// Example usage: Convert address to FIPS code
addressToFips(address, googleApiKey)
    .then(fips => {
        if (fips) {
            console.log("FIPS Code:", fips);
        } else {
            console.log("Could not retrieve FIPS code.");
        }
    });
