import React, { Component } from "react";

import axios from 'axios';

import "./datePickers.css";
import Axios from "axios";

class datePickers extends Component {
  state = {
    joinProess: "List",

    selectPanelFlg: true,

    retList: []
  };

  handleJoinProcess = async () => {
    alert('we clicked on radio buttons')
    await this.setState({
      selectPanelFlg: false
    })
  }


  handleFullList = async () => {
    alert('I clicked the handle list ...')
    let url = '';
    let servername = 'http://localhost:5005';
    let apiName = '/routes/logs/readLog';
    // let param = "?fromdate=" + this.state.fromDate + "&toDate=" + this.state.toDate;
    // url = servername + apiName + param;
    url = servername + apiName;
    try {
      console.log('inside the try for get');
      let ret = await axios.get(url);
      console.log('ret:', ret);
      await this.setState({
        retList: ret,
        selectPanelFlg: false
      })
    } catch(err){
      console.log(err.message);
    }
  }

  render() {

    let filterTypeSelectionPanel = (
        <div className="row">
          <div className="col text-center radio-fonts">
            <strong>Joining Process: &nbsp;&nbsp;</strong>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="List"
                  checked={this.state.joinProcess === "List"}
                  onChange={this.handleJoinProcess}
                />{" "}
                List
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="byDate"
                  checked={this.state.joinProcess === "byDate"}
                  onChange={this.handleJoinProcess}
                />{" "}
                By Date
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="byErrorId"
                  checked={this.state.joinProcess === "byErrorId"}
                  onChange={this.handleJoinProcess}
                />{" "}
                By Error Id
              </label>
            </div>
          </div>
        </div>
    )
    
    let buttonPanel = (
       <div>
         <button 
           onClick={this.handleFullList}
           className="something"
           >
             Get Full List
           </button>
       </div>
    )

    let outpanel;

    if ( this.state.selectPanelFlg ) {
      outpanel = filterTypeSelectionPanel;
    } else {
      outpanel = "This is not selection ..."
    }
    let outputPanel = (
      <div>
        <div className="row">
          <div className="col-6">
            {outpanel}
            {buttonPanel}
          </div>
        </div>
      </div>
    )
    return (
      <div>
        {outputPanel}
      </div>
    );
  }
}

export default datePickers;

  // <>
   

      {/* <form method="post" className="container ">
        <div className="d-flex flex-row">    

        <div className="form-group col-sm-4"> 
        <div className="row">    
          <label className="control-label col-sm-4">Start Date:</label>
          <input className="form-control col-sm-4" id="date" name="date" placeholder="MM/DD/YYY" type="text"/>
        </div>
        </div>
      
        <div className="form-group col-sm-4 "> 
        <div className="row">    
          <label className="control-label col-sm-4">End Date:</label>
          <input className="form-control col-sm-4" id="date" name="date" placeholder="MM/DD/YYY" type="text"/>
        </div>
        </div>

        <div className="form-group col-sm-2 "> 
          <button className="btn btn-primary " name="submit" type="submit">Submit</button>
        </div>
    
        </div>

     </form> */}



      // </>