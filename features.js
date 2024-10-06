// Get the current URL's query parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the 'address' parameter from the URL
const address = urlParams.get('address');

console.log(address);

// Import the necessary functions (if using a module system)
const { searchRegion, regionLookupClient } = require('@googlemaps/region-lookup');

// Ensure that the address is defined
if (address) {
    const headers = {
        "X-Goog-Api-Key": "AIzaSyDgJAElA3fsD-bZ-LXMVJpGd_4cbglLV2U",
    };

    const data = {
        search_values: [
            {
                "address": address,
                "place_type": "address",
                "region_code": "us"
            },
        ],
    };

    // Using an async function to await the response
    async function fetchRegion() {
        try {
            const response = await regionLookupClient.searchRegion({ headers, data });
            console.log(response); // Handle the response here
        } catch (error) {
            console.error('Error fetching region:', error);
        }
    }

    // Call the fetchRegion function
    fetchRegion();
} else {
    console.warn('No address parameter found in the URL.');
}
