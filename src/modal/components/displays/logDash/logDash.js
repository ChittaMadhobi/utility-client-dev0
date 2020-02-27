import React, { Component } from "react";
import "./logDash.css";
// import datePickers from "../datePickers/datePickers";
import DatePicker from '../datePickers/datePickers';
import LogTable from '../LogTable/LogTable';

class logDash extends Component {
  state = {};

  render() {
    return (
      <>
        {/* lobby header repreated down below?? */}
        <div className="row lobbyheader">
          <div className="col text-center banner-text">Better Together</div>
        </div>

        <br></br>


        <div>
          <p className="text-center">
            To access the logging system, select the start date and end date for
            the information you wish to view
          </p>
        </div>

        <DatePicker />

        <h4 className="text-center">View Log</h4>

        <LogTable />
      </>
    );
  }
}

export default logDash;
