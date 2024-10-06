// Get the current URL's query parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the 'address' parameter from the URL
const address = urlParams.get('address');

console.log(address); // This will log the 'address' value to the console
