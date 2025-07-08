async function getCoordinates(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      return { latitude, longitude };

    } else {
      console.log("No results found");
      return null ;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
}

module.exports = getCoordinates;
