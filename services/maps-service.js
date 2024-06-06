const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

const getFullAddress = async partialAddress => {
  try {
    const response = await googleMapsClient.geocode({address: partialAddress}).asPromise();
    const results = response.json.results;
    console.log('Formatted address from Google Maps:', results[0].formatted_address);
    return results[0].formatted_address;
  } catch (err) {
    console.log(`Could not get full address: ${partialAddress}`, err);
  }
};

const getLatLng = async partialAddress => {
  try {
    const response = await googleMapsClient.geocode({address: partialAddress}).asPromise();
    const results = response.json.results;
    console.log('Lat, Lng from Google Maps:', results[0].geometry.location);
    return results[0].geometry.location;
  } catch (err) {
    console.log(`Could not get full address: ${partialAddress}`, err);
  }
};

module.exports = { getFullAddress, getLatLng };