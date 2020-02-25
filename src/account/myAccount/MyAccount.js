import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

import Profile from './components/profile/Profile';

// import Profile from '../../intelligence/components/persona/InitialProfile';

import "./MyAccount.css";

class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      profileFlag: true,
      creditFlag: false,
      reportsFlag: false,
      investFlag: false
    };
  }

  // This is to show the info panel
  openAlertModal = () => {
    let msg = {
      Header: "Your Account Handling",
      Body: {
        oneLineSummary: `This will enable you to handle your account related acctivites.`,
        steps: [
          {
            step: "Profile (Includes Password Reset)",
            stepNote:
              "This button will enable you to edit your profile as well as change your password."
          },
          {
            step: "Credit",
            stepNote:
              "This will show your present credit balance as well as enable you to request & purchase more credits."
          },
          {
            step: "Reports",
            stepNote:
              "This will show your account usage statement. If you are an investor, it will also allow you to see your portfolio and overall Baanda operational activities, fund usage overview, including board's fund usage decisions and more ... "
          },
          {
            step: "Investment",
            stepNote:
              "This will provide you with various investment opportunities."
          }
        ],
        footnote:
          "This is high level overview of each functional buttons at this level of MyAccount. Each sub-functions will contain thiir info for details on each of their areas."
      },
      Footer: "This is the footer"
    };
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: msg,
        closeModal: this.closeModal
      },
      "infoModal"
    );
  };

  handleSelectedFunction = async selected => {
    // alert("Params commName=" + selected);
    if (selected === "profile") {
      await this.setState({
        profileFlag: true,
        creditFlag: false,
        reportsFlag: false,
        investFlag: false
      });
    } else if (selected === "credits") {
      await this.setState({
        profileFlag: false,
        creditFlag: true,
        reportsFlag: false,
        investFlag: false
      });
    } else if (selected === "reports") {
      await this.setState({
        profileFlag: false,
        creditFlag: false,
        reportsFlag: true,
        investFlag: false
      });
    } else if (selected === "invests") {
      await this.setState({
        profileFlag: false,
        creditFlag: false,
        reportsFlag: false,
        investFlag: true
      });
    }
  };

  goToLobby = () => {
    this.props.history.push("/lobby");
  }

  render() {
    console.log("MyAccount props:", this.props);

    let wipOutputPanel = (
      <div className="text-center">
        <br />
        <p align="justify">
          This will be released progressively in next few months.
        </p>
      </div>
    );

    let profileOutputPanel = (
        <div>
            <Profile />
        </div>
    )

    let activePanel;
    if (this.state.profileFlag) {
      activePanel = profileOutputPanel;
    } else if (this.state.creditFlag) {
      activePanel = wipOutputPanel;
    } else if (this.state.reportsFlag) {
      activePanel = wipOutputPanel;
    } else if (this.state.connectFlag) {
      activePanel = <div>{wipOutputPanel}</div>;
    }

    let myAccountPanel;
    myAccountPanel = (
      <div>
        <div className="row page-top">
          {/* <div className="col-6 access_list_header">Engagements</div> */}
          <div className="col market_header_spacing">
            <button
              className={`${
                this.state.profileFlag
                  ? "btn_top_myaccount_active"
                  : "btn_top_myaccount_passive"
              }`}
              //   className="btn_top_myaccount_active"
              type="button"
              onClick={() => this.handleSelectedFunction("profile")}
            >
              <b>Profile</b>
            </button>
            &nbsp;
            <button
              className={`${
                this.state.creditFlag
                  ? "btn_top_myaccount_active"
                  : "btn_top_myaccount_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("credits")}
            >
              <b>Credits</b>
            </button>
            &nbsp;
            <button
              className={`${
                this.state.reportsFlag
                  ? "btn_top_myaccount_active"
                  : "btn_top_myaccount_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("reports")}
            >
              <b>Reports</b>
            </button>
            &nbsp;
            <button
              className={`${
                this.state.investFlag
                  ? "btn_top_myaccount_active"
                  : "btn_top_myaccount_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("invest")}
            >
              <b>Invest</b>
            </button>
            &nbsp;
            <button
              className="btn-modal-myaccount"
              type="button"
              onClick={this.openAlertModal}
            >
              <b>Info</b>
            </button>
            &nbsp;
            <button
              className="btn-myaccount-back"
              type="button"
              onClick={this.goToLobby}
            >
              <i className="fas fa-step-backward" />
              {/* <b>Back</b> */}
            </button>
          </div>
        </div>
        {activePanel}
        <ModalContainer />
      </div>
    );

    return <div className="text-center">{myAccountPanel}</div>;
  }
}

MyAccount.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    // console.log(
    //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
    // );
    dispatch(showModal({ modalProps, modalType }));
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyAccount)
);
