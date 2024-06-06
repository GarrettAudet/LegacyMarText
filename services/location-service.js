const toRadians = degrees => degrees * Math.PI / 180;

function getDistance({lat: lat1, lng: lng1}, {lat: lat2, lng: lng2}) {
  if ((lat1 === lat2) && (lng1 === lng2)) {
    return 0;
  }
  const radlat1 = toRadians(lat1);
  const radlat2 = toRadians(lat2);
  const theta = lng1 - lng2;
  const radtheta = toRadians(theta);
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

module.exports = {getDistance};