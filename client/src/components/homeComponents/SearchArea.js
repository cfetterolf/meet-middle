import React from 'react';
import styled from 'styled-components';
//import MapContainer from '../mapComponents/MapContainer';
import MapSearchBar from '../mapComponents/MapSearchBar';

const addFriendStyle = {
  height: '40px',
  backgroundColor: 'white',
  borderRadius: '2px',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08)',
  textAlign: 'center',
  padding: '5px',
  border: 'honeydew',
  outline: 'none',
};

const AddFriendButton = styled.div`
  height: 40px;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
  text-align: center;
  padding: 5px;
  border: honeydew;
  outline: none;
`;

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
          <div className="col-12" style={{ paddingBottom: '0px' }}>
            <MapSearchBar
              selected={loc => this.handleSelect(loc)}
              geoSelected={geo => this.handleGeo(geo)}
              removeSelected={loc => this.handleRemove(loc)}
              displayText="Where are you?"
              {...this.props}
            />
          </div>
          <div className="col-12">
            <MapSearchBar
              selected={loc => this.handleSelect(loc)}
              geoSelected={geo => this.handleGeo(geo)}
              removeSelected={loc => this.handleRemove(loc)}
              displayText="Where is your friend?"
              {...this.props}
            />
          </div>
          <div className="col-12">
            <AddFriendButton>
              <p style={{ color: '#757575' }}>Add another friend</p>
            </AddFriendButton>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchArea;
