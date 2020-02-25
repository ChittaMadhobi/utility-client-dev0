import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Chart } from "react-google-charts";

// import axios from "axios";
// import moment from "moment";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";

const pieOptions = {
  title: "Category Revenue Pie",
  // pieHole: 0.6,
  is3D: true,
  backgroundColor: "black",
  // slices: [
  //   {
  //     color: "#2BB673"
  //   },
  //   {
  //     color: "#d91e48"
  //   },
  //   {
  //     color: "#007fad"
  //   },
  //   {
  //     color: "#e9a227"
  //   }
  // ],
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "fcebb3",
      fontSize: 12
    }
  },
  tooltip: {
    showColorCode: true
  },
  // chartArea: {
  //   left: 0,
  //   top: 0,
  //   width: "100%",
  //   height: "80%"
  // },
  fontName: "Roboto"
};

// const pieOption2 = {
//   title: "Category Revenu Distribution",
//   // Just add this option
//   is3D: true,
//   backgroundColor: "yellow",
//   legend: {
//     position: "bottom",
//     alignment: "center",
//     textStyle: {
//       color: "233238",
//       fontSize: 14
//     }
//   }
//   // chartArea: {
//   //   left: 0,
//   //   top: 100,
//   //   width: "100%",
//   //   height: "80%"
//   // }
// };

class VisualChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      stateData: []
    };
  }

  componentDidMount = async () => {
    let head = ["Category", "Revenue"];
    let dataArray = [];
    dataArray.push(head);
    this.props.message.Body.forEach(obj => {
      let locArry = [ obj.category, Number(obj.cost.toFixed(2))]
      dataArray.push(locArry); 
    });

    console.log('------- >>> dataArray: ', dataArray); 
    await this.setState({
      stateData: dataArray
    });
    console.log(' --- this.')
  }

  closeModal = e => {
    e.preventDefault();
    const modTask = {
      todotext: this.state.todotext
    };
    this.props.hideModal(modTask);
  };

  render() {

    let data=[
      ["Category", "Revenue"],
      ["Category 1", 34.5],
      ["Category 2", 44.5],
      ["Commute", 50.43],
      ["Watch TV", 20.1],
      ["Sleep", 80.9]
    ];
    console.log('data >>>>>>>>: ', data);

    let data1 = this.state.stateData;
    console.log('data1 ------>>: ', data1);
    

    console.log('&&&&&&&&&&& this.props:', this.props.message.Body);
    console.log( '$$$$$$$$$$ this.state:', this.state);
    let showPiCategory = (
      <div>
        <div>
          <Chart
            width={"100%"}
            height={"100%"}
            chartType="PieChart"
            //   loader={<div>Loading Chart</div>}
            data={data1}
            options={pieOptions}
            rootProps={{ "data-testid": "2" }}
          />
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="report-header-text">
              {/* Overview of header here ...{" "} */}
              <font color="white">Category Revenue Pie</font>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-charts">{showPiCategory}</div>
          </div>

          <div className="modal-footer">
            {/* <button
                type="button"
                className="report-modal-remind-button"
                onClick={this.sendReminder}
                onChange={this.onChange}
              >
                <strong>Remind</strong> &nbsp;
                <div className="float-right">
                  <i className="far fa-paper-plane" />
                </div>
              </button> */}
            &nbsp;&nbsp;
            <button
              type="button"
              className="report-modal-button"
              onClick={this.closeModal}
              onChange={this.onChange}
            >
              <strong>Close</strong> &nbsp;
              <div className="float-right">
                <i className="far fa-window-close" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

VisualChart.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(VisualChart);
