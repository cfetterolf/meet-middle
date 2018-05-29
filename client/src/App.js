import React from 'react';
import SearchArea from './components/homeComponents/SearchArea';
import MapArea from './components/homeComponents/MapArea';
import FilterArea from './components/homeComponents/FilterArea';
import ResultsListMobile from './components/homeComponents/ResultsListMobile';
import ResultsListDesktop from './components/homeComponents/ResultsListDesktop';
import { filterResults } from './components/mapComponents/filter';
import './css/ResultsList.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocations: [],
      getMoreResults: false,
      filteredResults: [],
      filterOptions: {
        minRating: 4.0,
        maxPrice: 3,
        type: ['restaurant', 'bar'],
        maxNumber: 15,
        radius: 2000,
      },
    };

    this.clearMap = this.clearMap.bind(this);
    this.moreResults = this.moreResults.bind(this);
  }

  clearMap() {
    this.setState({ userLocations: [] });
  }

  moreResults() {
    this.setState({ getMoreResults: true });
  }

  getPlacesResults(geo) {
    fetch(`api/places?lat=${geo.lat}&lng=${geo.lng}&radius=${this.state.filterOptions.radius}`,
      { headers: new Headers({ 'Content-type': 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((placeData) => {
        this.filterResults(placeData);
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  filterResults(placeData) {
    const filteredResults = filterResults(
      placeData.body.results,
      this.state.filterOptions.minRating,
      this.state.filterOptions.maxPrice,
      this.state.filterOptions.type,
      this.state.filterOptions.maxNumber);

    this.setState({ filteredResults });
  }

  render() {
    return (
      <div>
        <div className="row" style={{ marginLeft: '0', marginRight: '0', paddingTop: '10px' }}>
          <div className="col-lg-3">
            <SearchArea
              clearLocation={ this.state.userLocations.length !== 0 ? false : true }
              updateLocations={userLocations => this.setState({ userLocations })}
            />
            <FilterArea clearMap={this.clearMap} moreResults={this.moreResults}/>
          </div>
          <div className="col-lg-9">
            <MapArea
              getPlacesResults={geo => this.getPlacesResults(geo)}
              getMoreResults={this.state.getMoreResults}
              userLocations={this.state.userLocations}
              filteredResults={this.state.filteredResults}
            />
            <div className="results-list-mobile">
              <ResultsListMobile />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
