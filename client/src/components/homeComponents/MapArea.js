import React from 'react';
import MapContainer from '../mapComponents/MapContainer';
//import PlacesExample from '../mapComponents/PlacesExample';


const mapStyle = {
  width: '100%',
  height: '600px',
};

class MapArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocations: [],
      filteredResults: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userLocations !== nextProps.userLocations) {
      this.setState({ userLocations: nextProps.userLocations });
    }

    if (this.props.filteredResults !== nextProps.filteredResults) {
      this.setState({ filteredResults: nextProps.filteredResults });
    }
  }

  render() {
    return (
      <div style={mapStyle}>
        <MapContainer
          userLocations={this.state.userLocations}
          getPlacesResults={geo => this.props.getPlacesResults(geo)}
          filteredResults={this.state.filteredResults}
        />
      </div>
    );
  }
}

export default MapArea;
