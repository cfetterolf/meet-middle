import React from 'react';
import SearchArea from './components/homeComponents/SearchArea';
import MapArea from './components/homeComponents/MapArea';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocations: [],
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-3">
            <SearchArea
              updateLocations={userLocations => this.setState({ userLocations }, console.log(this.state.userLocations))}
            />
          </div>
          <div className="col-lg-9">
            <MapArea
              userLocations={this.state.userLocations}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
