import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const mapStyle = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
};

// Source: https://math.stackexchange.com/questions/1801867/finding-the-centre-of-an-abritary-set-of-points-in-two-dimensions?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
const findCenterCoord = (locations) => {
  const n = locations.length;
  let lat_centroid = 0, lng_centroid = 0;

  for (let i in locations) {
    lat_centroid += locations[i].geo.lat;
    lng_centroid += locations[i].geo.lng;
  }

  return {
    lat: lat_centroid /= n,
    lng: lng_centroid /= n,
  }
}

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: 40.7127753, lng: -74.0059728 }} // NYC
  >
    {props.userLocations.map(location => (
      props.isMarkerShown && <Marker position={location.geo} />
    ))}
    { props.isMarkerShown && props.userLocations.length > 0 && <Marker position={findCenterCoord(props.userLocations)}/> }
  </GoogleMap>
));

class MapContainer extends React.Component {
  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    return (
      <MapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={mapStyle} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...this.props}
      />
    )
  }
}

export default MapContainer;
