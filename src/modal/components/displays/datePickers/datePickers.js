import React, { Component } from "react";

import axios from 'axios';

import "./datePickers.css";
import Axios from "axios";

class datePickers extends Component {
  state = {
    joinProess: "List",
     
    selectPanelFlg: true,
    showFullListFlg: false,
    retList: []
  };

  handleJoinProcess = async () => {
    alert('we clicked on radio buttons')
    await this.setState({
      selectPanelFlg: false
    })
  }


  handleFullList = async () => {
    // alert('I clicked the handle list ...')
    let url = '';
    let servername = 'http://localhost:5005';
    let apiName = '/routes/logs/readLog';
    // let param = "?fromdate=" + this.state.fromDate + "&toDate=" + this.state.toDate;
    // url = servername + apiName + param;
    url = servername + apiName;
    try {
      console.log('inside the try for get');
      let ret = await axios.get(url);
      console.log('ret:', ret.data.Msg);
      let listout = false;
      if ( ret.data.Msg.length > 0) {
        console.log('inside ret.length:', ret.data.Msg.length);
        console.log('listout:', listout);
        listout = true
      }
      await this.setState({
        retList: ret.data.Msg,
        // selectPanelFlg: false
        showFullListFlg: listout
      })
    } catch(err){
      console.log(err.message);
    }
  }

  render() {
    console.log('this.state:', this.state.retList);
    // let xx1 = this.state.retList[0];
    // console.log('xx:', xx1);
    // console.log('typeof:', typeof xx1);
    // console.log(JSON.stringify(xx1));
    // let yy = JSON.stringify(xx1);
    // let zz = JSON.parse(yy); 

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
       <div className="text-center">
         <button 
           onClick={this.handleFullList}
           className="something"
           >
             Get Full List
           </button>
       </div>
    )
    
  let listPanel;
  if ( this.state.showFullListFlg) {
    listPanel = (
      <div>
       this is my list panel
       {/* {this.state.retList[0]} */}
      </div>
    );
  } 


    let outpanel;

    if ( this.state.selectPanelFlg ) {
      outpanel = filterTypeSelectionPanel;
    } 

    // if ( this.state.showFullListFlg) {
    //   outputPanel = listPanel
    // }

    let outputPanel = (
      <div>
        <div className="row">
          <div className="col">
            {outpanel}
            {buttonPanel}
            {listPanel}
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
