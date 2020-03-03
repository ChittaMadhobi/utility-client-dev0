import React, { Component } from "react";
import "./logDash.css";
import DatePicker from '../datePickers/datePickers';
import LogTable from '../LogTable/logTable';

// const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

// //unsure about where to put this api??
// const ifErrorExistsAPI = "/routes/dashboard/ifErrorExists?";
 

// let params = "errorId=" + this.props.errorid + "&appName=" +
// this.state.appName + "&errorType=" + this.state.errorType;

// let url = baandaServer + ifErrorExistsAPI + params;

// try {
// let ret = await axios.get(url);

// if (ret.data.status === "Error") {
//   await this.setState({
//     createErrorMsg: "Error exisits. Click to view details.",
//     createErrorStatus: true
//   });

//   isValid = false;
// } else {
//   await this.setState({
//     createErrorMsgErrFlag: false
//   });
// }
// } catch (err) {
// console.log("IfErrorExistsAPI Error:", err.message);
// }



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

        {/* <h4 className="text-center">Log</h4> */}

        {/* <LogTable /> */}
      </>
    );
  }
}

export default logDash;
