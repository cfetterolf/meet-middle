
export function filterResults(results, minRating, maxPrice, types, number) {
  let filteredResults = [];

  // sort results by rating
  results.sort(compareBy('rating'));

  let numAdded = 0;
  for (let i in results) {
    const place = results[i];

    if (place.rating >= minRating &&
        place.price_level <= maxPrice &&
        arrayContainsArray(place.types, types) &&
        numAdded < number)
    {
      filteredResults.push(place);
      numAdded += 1;
    }
  }

  return filteredResults;
}


function compareBy(key) {
  return function (a, b) {
    if (a[key] < b[key]) return 1;
    if (a[key] > b[key]) return -1;
    return 0;
  };
}

function arrayContainsArray (superset, subset) {
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}
