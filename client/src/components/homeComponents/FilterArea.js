import React from 'react';
import { Button } from 'reactstrap';

class FilterArea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
        <div style={{ }}>
          <h5 style={{ float: 'left' }}>Filters</h5>
          <a role="button" tabIndex={0} style={{ float: 'right' }}>Show more </a>
        </div>
        <div style={{ clear: 'both' }} />
        <Button color="success" onClick={() => this.props.moreResults()}>More Results</Button>{' '}
        <Button color="danger" onClick={() => this.props.clearMap()}>Clear Map</Button>
      </div>
    );
  }
}

export default FilterArea;
