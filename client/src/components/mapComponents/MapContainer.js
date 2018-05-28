import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
//import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { filterResults } from './filter';

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

const getPlacesResults = (geo) => {
  fetch(`api/places?lat=${geo.lat}&lng=${geo.lng}`, { headers: new Headers({ 'Content-type': 'application/json' }) })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status_text);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch(err => console.log(err)); // eslint-disable-line no-console
}

const MapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: 40.7127753, lng: -74.0059728 }} // NYC
  >
    {props.userLocations.map((location, i) => (
      props.isMarkerShown && <Marker key={i} position={location.geo} defaultTitle={location.name}/>
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
    getPlacesResults({ lat: 40.7127753, lng: -74.0059728 });
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
    fetch(`api/places?lat=${geo.lat}&lng=${geo.lng}`, { headers: new Headers({ 'Content-type': 'application/json' }) })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status_text);
        }
        return response.json();
      })
      .then((placeData) => {
        this.setState({ placeData })
      })
      .catch(err => console.log(err)); // eslint-disable-line no-console
  }

  render() {
    if (this.props.userLocations.length > 1) {
      const middleCoord = findCenterCoord(this.props.userLocations);
      if (middleCoord.lat !== middle.lat && middleCoord.lng !== middle.lng) {
        middle = middleCoord;
        this.getPlacesResults(middleCoord);
      }
    }

    if (this.state.placeData) {
      console.log(filterResults(this.state.placeData.body.results, 4.0, 2, ['restaurant', 'bar'], 10));
    }

    return (
      <MapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCCcm1_IdCQxK6VPbkwprS2ya3BT_o7mI4&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={mapStyle} />}
        mapElement={<div style={{ height: `100%` }} />}
        {...this.props}
      />
    )
  }
}

export default MapContainer;
