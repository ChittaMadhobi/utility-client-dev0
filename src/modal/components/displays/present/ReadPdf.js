import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";

import "./ReadPdf.css";

class ReadPdf extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todotext: ""
    };
  }
  closeModal = e => {
    e.preventDefault();
    const modTask = {
      todotext: this.state.todotext
    };
    this.props.hideModal(modTask);
  };

  render() {
    console.log("ReadPdf this.props:", this.props);
    // console.log('The file name:', this.props.message.Body.theFile.name);

    // // let modalBody = "This is the modal body";
    // let headerText = this.props.message.Body.theFile.name;
    // let pdfdata = this.props.message.Body.pdfPreviewUrl;
    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="pdf-header-text">
              {/* Overview of header here ...{" "} */}
              <font color="white">DFB FILE NAME</font>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-showpdf">
                <iframe
                src="https://baandaproduction.s3-us-west-2.amazonaws.com/Baanda+Pitch+050719.pdf"
                title="testing pdfread"
                className="show_pdf_doc"></iframe>
            </div>
          </div>
          {/* <div className="modal-body">
            <div className="fixedsize-showpdf">
              <iframe
                src={pdfdata}
                title="testing pdfread"
                className="show_pdf_doc"
              ></iframe>
            </div>
          </div> */}

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

ReadPdf.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(ReadPdf);
