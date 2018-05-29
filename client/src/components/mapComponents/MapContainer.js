/*global google*/
import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"

const mapStyle = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
};

let middle = {};

// Source: https://math.stackexchange.com/questions/1801867/finding-the-centre-of-an-abritary-set-of-points-in-two-dimensions?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
const findCenterCoord = (locations) => {
  const n = locations.length;
  let lat_centroid = 0, lng_centroid = 0;

  for (let i in locations) {
    lat_centroid += locations[i].geo.lat;
    lng_centroid += locations[i].geo.lng;
  }

  const middleCoord = {
    lat: lat_centroid /= n,
    lng: lng_centroid /= n,
  }

  return middleCoord;
}

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: 40.7127753, lng: -74.0059728 }}
    ref={(map) => props.onMapMounted(map)}
  >
    {props.userLocations.map((location, i) => (
      props.isMarkerShown &&
      <Marker key={i} position={location.geo} defaultTitle={location.name}>
        <InfoWindow>
          <div>
            {location.name}
          </div>
        </InfoWindow>
      </Marker>
    ))}
    {props.userLocations.length >= 2 &&
      props.filteredResults.map((place, i) => (
      <Marker key={i} position={place.geometry.location} defaultTitle={place.name}>
        <InfoWindow>
          <div>
            {place.name}
          </div>
        </InfoWindow>
      </Marker>
    ))}
  </GoogleMap>
));

class MapContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMarkerShown: false,
      placeData: null,
    }
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

  getPlacesResults(geo) {

  }

  setBounds(map, locations) {
    let bounds = new google.maps.LatLngBounds();
    for (let i in locations) {
      bounds.extend(locations[i].geo);
    }
    map.fitBounds(bounds);
  }

  render() {
    if (this.props.userLocations.length > 1) {
      const middleCoord = findCenterCoord(this.props.userLocations);

      // we received a new middle coordinate
      if (middleCoord.lat !== middle.lat && middleCoord.lng !== middle.lng) {
        middle = middleCoord;
        this.props.getPlacesResults(middleCoord);

        // set map bounds based on user locations
        this.setBounds(this._map, this.props.userLocations);
      }
    }

    return (
      <MapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCCcm1_IdCQxK6VPbkwprS2ya3BT_o7mI4&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={mapStyle} />}
        mapElement={<div style={{ height: `100%` }} />}
        onMapMounted={(ref) => this._map = ref}
        {...this.props}
      />
    )
  }
}

export default MapContainer;
