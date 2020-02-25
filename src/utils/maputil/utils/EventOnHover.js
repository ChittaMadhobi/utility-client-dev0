import React, { Component } from "react";
import { PropTypes } from "prop-types";

import "../MainMap.css";

class EventOnHover extends Component {
  static propTypes = {
    // use hover from controllable
    hover: PropTypes.bool,
    text: PropTypes.string
  };

  static defaultProps = {};

  render() {
    //  console.log('EventOnHover this.props:', this.props);
    //  console.log('EventOnHover this.props:', this.props);

    const vis = this.props.hover ? "visible box-to-display" : "invisible";

    return ( 
      <div className="place-style">
        <div>{this.props.id}</div>
        <div className={vis}>
          <div className="row"> 
            <div className="col text-center">
              <div className="intel_font text-center">
                <div>{this.props.nameOfPlace}</div>
                <p>{this.props.address}&nbsp;||&nbsp;
                Lat:{this.props.lat}&nbsp;Lng:{this.props.lng}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventOnHover;
