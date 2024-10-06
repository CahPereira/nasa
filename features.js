// Get the current URL's query parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the 'address' parameter from the URL
const address = urlParams.get('address');

console.log(address); 


import {
    searchRegion,
    RegionSearchValue,
    SearchRegionRequestData,
    SearchRegionResponse
  } from "@googlemaps/region-lookup";

  
  const headers = {
    "X-Goog-Api-Key": "AIzaSyDgJAElA3fsD-bZ-LXMVJpGd_4cbglLV2U",
  };
  
  const data: SearchRegionRequestData = {
    search_values: [
      {
        "address": address ,
        "place_type": "address" as const,
        "region_code": "us"
      },
    ],
  };
  const response = await regionLookupClient.searchRegion({ headers, data });
  