import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import moment from "moment";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";

import "./InvoiceDetails.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const sendPaymentReminder = "/routes/reports/sendPaymentReminder";

class InvoiceDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      todotext: "",

      payOverdueFlag: false,
      emailSentMsg: null
    };
  }

  componentDidMount = async () => {
    let today = moment();
    let npayday = this.props.message.Body.paySchedulePolicy.nextSchedulePayday;
    if (!npayday || npayday === null){
      npayday = "NotSlected"
    }
    console.log("npayday: ", npayday);
    console.log("today:", today);

    if (moment(today).isAfter(npayday)) {
      await this.setState({
        payOverdueFlag: true
      });
    }
  };

  sendReminder = async () => {
    // alert("sending reminder");
    if (
      this.props.message.Body.financeBreakdown.amountPaid <
      this.props.message.Body.financeBreakdown.totalInvoiceAmount
    ) {
      let url = baandaServer + sendPaymentReminder;
      let data = {
        inv: this.props.message.Body,
        templateType: "templateReminder"
      };
      console.log("send Reminder url:", url, " data:", data);
      try {
        let ret = await axios.post(url, data);
        console.log("ret: ", ret);
        await this.setState({
          emailSentMsg: ret.data.Msg
        });
      } catch (err) {
        console.log("email Error:", err.message);
      }
    } else {
      console.log("No pending amount to remind.");
      await this.setState({
        emailSentMsg: "Fully paid. Nothing to remind."
      });
    }
  };

  closeModal = e => {
    e.preventDefault();
    const modTask = {
      todotext: this.state.todotext
    };
    this.props.hideModal(modTask);
  };

  render() {
    console.log("InvoiceDetail Modal props:", this.props);
    // console.log("reportType:", this.props.message.reportType);
    // console.log("this.state: ", this.state);
    // console.log('this.props.message.Body.paySchedulePolicy:', this.props.message.Body.paySchedulePolicy);
    // console.log('this.props.message.Body.paySchedulePolicy.nextSchedulePayday:', this.props.message.Body.paySchedulePolicy.nextSchedulePayday);
    // console.log('Length:', this.props.message.Body.paySchedulePolicy.nextSchedulePayday.length);

    let baandaIdPanel;
    if (this.props.message.Body.invoiceOfBaandaId === 0) {
      baandaIdPanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">BaandaId:</div>
            <div className="col-8 text-left value-format">Not yet a Baanda</div>
          </div>
        </div>
      );
    } else {
      baandaIdPanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">BaandaId:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.invoiceOfBaandaId}
            </div>
          </div>
        </div>
      );
    }

    let itemPanel = (
      <div>
        <div className="row">
          <div className="col-5 text-left item-header-name ">Name</div>
          <div className="col-2 text-center item-header-rest ">Prc $</div>
          <div className="col-2 text-center item-header-rest ">Qty</div>
          <div className="col-3 text-center item-header-rest ">Cost $</div>
        </div>
        <hr className="inv-format" />
        {this.props.message.Body.itemDetails.map((item, i) => (
          <div key={i}>
            <div className="row">
              <div className="col-5 text-left item-header-name ">
                {item.itemName.length > 20
                  ? item.itemName.substring(0, 20)
                  : item.itemName}
              </div>
              <div className="col-2 text-center item-header-rest ">
                {item.price.toFixed(2)}
              </div>
              <div className="col-2 text-center item-header-rest ">
                {item.quantity}
              </div>
              <div className="col-3 text-center item-header-rest ">
                {item.cost.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    let paySchedulePanel;

    if (this.props.message.Body.paySchedule.value === "partpay") {
      paySchedulePanel = ( 
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">Policy:</div>
            <div className="col-8 text-left value-format">
              Part Pay - part IOU
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Due On:</div>
            <div
              className={`${
                !this.state.payOverdueFlag
                  ? "col-8 text-left value-format"
                  : "col-8 text-left value-format-overdue"
              }`}
            >
              { (this.props.message.Body.paySchedulePolicy && this.props.message.Body.paySchedulePolicy.nextSchedulePayday && this.props.message.Body.paySchedulePolicy.nextSchedulePayday.length >= 10) ?               this.props.message.Body.paySchedulePolicy.nextSchedulePayday.substring(0, 10) : "Paid"}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Due Amt:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.paySchedulePolicy.nextPayAmount.toFixed(
                2
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Last Paid:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.financeBreakdown.lastPaymentDate.substring(
                0,
                10
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Last Amt:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.financeBreakdown.lastPaymentAmount.toFixed(
                2
              )}
            </div>
          </div>
        </div>
      );
    } else if (this.props.message.Body.paySchedule.value === "installment") {
      paySchedulePanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">Policy:</div>
            <div className="col-8 text-left value-format">Installment</div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Type:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.paySchedulePolicy.installmentType}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Due On:</div>
            <div
              className={`${
                !this.state.payOverdueFlag
                  ? "col-8 text-left value-format"
                  : "col-8 text-left value-format-overdue"
              }`}
            >
              {this.props.message.Body.paySchedulePolicy.nextSchedulePayday.substring(
                0,
                10
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Due Amt:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.paySchedulePolicy.nextPayAmount.toFixed(
                2
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Last Paid:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.financeBreakdown.lastPaymentDate.substring(
                0,
                10
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Last Amt:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.financeBreakdown.lastPaymentAmount.toFixed(
                2
              )}
            </div>
          </div>
        </div>
      );
    } else {
      paySchedulePanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">Policy:</div>
            <div className="col-8 text-left value-format">
              Fully paid on purchase
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Last Paid:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.paySchedulePolicy.nextSchedulePayday.substring(
                0,
                10
              )}
            </div>
          </div>
        </div>
      );
    }

    let modalBody;
    if (this.props.message.reportType === "invoiceDetials") {
      modalBody = (
        <div>
          <div className="row">
            <div className="col-4 text-right tag-format">Customer:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.customerName}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Invoice #:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.invoiceId}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Date:</div>
            <div className="col-8 text-left value-format">
              {this.props.message.Body.invoiceDate.substring(0, 10)}
            </div>
          </div>
          {baandaIdPanel}
          <hr className="inv-format" />
          <div className="row">
            <div className="col text-left tag-format">
              Financial State Breakdown
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Total Amt:</div>
            <div className="col-8 text-left value-format">
              $&nbsp;
              {this.props.message.Body.financeBreakdown.totalInvoiceAmount.toFixed(
                2
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Paid Amt:</div>
            <div className="col-8 text-left value-format">
              $&nbsp;
              {this.props.message.Body.financeBreakdown.amountPaid.toFixed(2)}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Pending:</div>
            <div className="col-8 text-left value-format">
              $&nbsp;
              {(
                this.props.message.Body.financeBreakdown.totalInvoiceAmount -
                this.props.message.Body.financeBreakdown.amountPaid
              ).toFixed(2)}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Tax:</div>
            <div className="col-8 text-left value-format">
              $&nbsp;
              {this.props.message.Body.financeBreakdown.taxAmount.toFixed(2)}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format">Discount:</div>
            <div className="col-8 text-left value-format">
              $&nbsp;
              {this.props.message.Body.financeBreakdown.discountAmount.toFixed(
                2
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right tag-format-special">Srv. Fee:</div>
            <div className="col-8 text-left value-format-special">
              $&nbsp;
              {this.props.message.Body.financeBreakdown.baandaServiceFee.toFixed(
                4
              )}{" "}
              &nbsp;(Not charged >> .25 of 1%)
            </div>
          </div>
          <hr className="inv-format" />
          <div className="row">
            <div className="col text-left header-item">Itamized Breakdown</div>
          </div>
          {itemPanel}
          <hr className="inv-format" />
          {paySchedulePanel}
          <hr className="inv-format" />
          <div className="row">
            <div className="col text-center email-sent-msg">
              {this.state.emailSentMsg}
            </div>
          </div>
          <div className="inv_details_space" />
        </div>
      );
    } else {
      modalBody = (
        <div className="text-center">
          Error: It is not being called from invoice details
        </div>
      );
    }

    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="report-header-text">
              {/* Overview of header here ...{" "} */}
              <font color="white">Invoice Details</font>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-invoice">{modalBody}</div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="report-modal-remind-button"
              onClick={this.sendReminder}
              onChange={this.onChange}
            >
              <strong>Remind</strong> &nbsp;
              <div className="float-right">
                <i className="far fa-paper-plane" />
              </div>
            </button>
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

InvoiceDetails.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(InvoiceDetails);
