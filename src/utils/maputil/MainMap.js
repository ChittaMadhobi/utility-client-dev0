import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { PropTypes } from "prop-types";
import controllable from "react-controllables";

import EventOnHover from "./utils/EventOnHover";

import "./MainMap.css";

const K_SIZE = 40;
const googleapikey = process.env.REACT_APP_GOOGLE_API_KEY;

const MainMap = controllable(["center", "zoom", "hoverKey", "clickKey"])(
  class MainMap extends Component {
    static propTypes = {
      center: PropTypes.any,
      zoom: PropTypes.number,
      hoverKey: PropTypes.string, // @controllable
      clickKey: PropTypes.string, // @controllable
      onCenterChange: PropTypes.func, // @controllable generated fn
      onZoomChange: PropTypes.func, // @controllable generated fn
      onHoverKeyChange: PropTypes.func, // @controllable generated fn
      //greatPlaceCoords: PropTypes.any
      greatPlaces: PropTypes.array
    };

    constructor(props) {
      super(props);
      this.state = {
        pointsOfIntersts: [],
        // allpointsOfInterst: [],
        selectedpointsOfInterst: "",
        intelIntent: "",
        search: ""
      };
    }

    componentDidMount = async () => {
      // await this.setState({
      //     pointsOfIntersts: this.props.data
      // })
      // console.log(
      //   "componentDidMount this.state.pointsOfInterst:",
      //   this.state.pointsOfIntersts
      // );
      // console.log("0 lat:", this.props.data.length);
      this.props.data.forEach(async elm => {
        // console.log("eml :", elm.nameOfPlace);
        await this.state.pointsOfIntersts.push(elm);
      });

      // this.state.pointsOfIntersts.forEach(elm => {
      //   console.log("eml s:", elm.nameOfPlace);
      // });
    };

    static defaultProps = {
      zoom: 12
    };

    _onChange = (center, zoom /* , bounds, marginBounds */) => {
      this.props.onCenterChange(center);
      this.props.onZoomChange(zoom); 
    };

    _onChildMouseEnter = (key /*, childProps */) => {
      this.props.onHoverKeyChange(key);
    };

    _onChildMouseLeave = (/* key, childProps */) => {
      this.props.onHoverKeyChange(null);
    };

    returnToCaller = () => {
      // console.log("returning to ShoaAnInviate");
      this.props.returnToShowInvite();
    };

    render() {
      // In real app, get this value from database ... with coordinate of
      // start-to work address provided in the posting by the candidate.
      // console.log("MainMap this.props:", this.props);
      // console.log('MainMap this.state:', this.state);

      let gapi = {
        key: googleapikey,
        language: "en"
      };

      //  User's address
      let center = {
        lat: this.props.data[0].lat,
        lng: this.props.data[0].lng
      };

      const places = this.state.pointsOfIntersts.map(pointsOfInterst => {
        // const places = this.state.locArry.map(pointsOfInterst => {
        // const { id, msg, ...coords } = place;
        // console.log('pointsOfInterst:', pointsOfInterst);
        // console.log('coords:', coords);
        const {
          id,
          shortDescription,
          intelForBubble,
          ...coords
        } = pointsOfInterst;

        let inter;
        if (id === "1") inter = "Y";
        else inter = "C";

        //msg = shortDescription;
        return (
          <EventOnHover
            key={id}
            {...coords}
            id={inter}
            text={shortDescription}
            intel={intelForBubble}
            // use your hover state (from store, react-controllables etc...)
            hover={this.props.hoverKey === id}
          />
        );
      });

      return (
        <div>
          <div className="row">
            <div className="col">
              <div className="map-box">
                <GoogleMapReact
                  bootstrapURLKeys={gapi}
                  center={center}
                  defaultZoom={this.props.zoom}
                  hoverDistance={K_SIZE / 2}
                  onChange={this._onChange}
                  onChildClick={this._onChildClick}
                  onChildMouseEnter={this._onChildMouseEnter}
                  onChildMouseLeave={this._onChildMouseLeave}
                >
                  {places}
                </GoogleMapReact>
              </div>
            </div>
          </div>
          <div className="row position-exit-btn">
            <div className="col-6 exit-btn-msg text-center">
              Click/hover on markers for more info.<br/>
              Zoom to locate the community (C)
            </div>
            <div className="col-6">
              <button
                className="btn-ret-from-map"
                type="button"
                onClick={this.returnToCaller}
              >
                <b>Exit Interactive Map-Intel</b>
              </button>
            </div>
          </div>
          <div className="map-bottom-space" />
        </div>
      );
    }
  }
);

// onBoundsChange={this._onBoundsChange}

export default MainMap;
