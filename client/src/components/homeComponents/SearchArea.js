import React from 'react';
//import MapContainer from '../mapComponents/MapContainer';
import MapSearchBar from '../mapComponents/MapSearchBar';

class SearchArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentLocation: '',
      locations: [],
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleGeo = this.handleGeo.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleSelect(location) {
    this.setState({ recentLocation: location });
  }

  handleGeo(geo) {
    let locations = this.state.locations;
    let locationObj = {
      name: this.state.recentLocation,
      geo,
    }

    if (!locations.includes(locationObj)) {
      locations.push(locationObj);
    }

    console.log(locations);
    this.setState({ locations }, this.props.updateLocations(locations))
  }

  handleRemove(location) {
    let locations = this.state.locations;
    for (var i in locations) {
      if (locations[i].name === location) {
        locations.splice(i, 1);
      }
    }

    console.log(locations);
    this.setState({ locations }, this.props.updateLocations(locations));
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12">
            <MapSearchBar
              selected={loc => this.handleSelect(loc)}
              geoSelected={geo => this.handleGeo(geo)}
              removeSelected={loc => this.handleRemove(loc)}
              displayText="Search for a location"
            />
          </div>
          <div className="col-12">
            <MapSearchBar
              selected={loc => this.handleSelect(loc)}
              geoSelected={geo => this.handleGeo(geo)}
              removeSelected={loc => this.handleRemove(loc)}
              displayText="Search for a location"
            />
          </div>
        </div>
        <a role="button" tabIndex="0" onClick={() => this.setState({ locations: [] })}>Clear</a>
      </div>
    );
  }
}

export default SearchArea;
