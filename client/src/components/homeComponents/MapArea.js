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
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userLocations !== nextProps.userLocations) {
      console.log(nextProps.userLocations);
      this.setState({ userLocations: nextProps.userLocations });
    }
  }

  render() {
    return (
      <div style={mapStyle}>
        <MapContainer userLocations={this.state.userLocations} />
      </div>
    );
  }
}

export default MapArea;
