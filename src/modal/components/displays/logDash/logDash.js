import React, { Component } from "react";
import "./logDash.css";
import DatePicker from '../datePickers/datePickers';
import LogTable from '../LogTable/logTable';

class logDash extends Component {
  constructor(props) {
    super(props);
    console.log(props)

  this.state = {
    // errorId: null,
    // programName: null,
    // messageType: null,
    // date: null,
    // message, null,
    };
  }


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

        <h4 className="text-center">Log</h4>

        <LogTable />
      </>
    );
  }
}

export default logDash;
