import React, { Component } from "react";
import "./logDash.css";

class logDash extends Component {
  state = {};

  render() {
    return (
      <>
        {/* lobby header repreated down below?? */}
        <div className="row lobbyheader">
          <div className="col text-center banner-text">Better Together</div>
        </div>

        <div>
          <p>
            To access the logging system, select the start date and end date for
            the information you wish to view
          </p>
        </div>
      </>
    );
  }
}

export default logDash;
