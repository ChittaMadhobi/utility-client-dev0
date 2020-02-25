import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ModalContainer from "../../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../../actions/modalActions";
import "../../../../modal/css/localModal.css";
import "../../../../modal/css/template.css";

import ResetPassword from "./ResetPassword";

import ProfileEdit from '../../../../intelligence/components/persona/InitialProfile';

import "./Profile.css";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      profileEditFlag: false,
      pwdRestFlag: true
    };
  }

  openAlertModal = () => {
    let msg = {
      Header: "Your Profile & Password",
      Body: {
        oneLineSummary: `This has all the information about the activities of the store..`,
        steps: [
          {
            step: "POS (Point 0f Sales)",
            stepNote:
              "At POS, you will be able to sell your items to members of your community. Even if your community is public, one has to join without invite first to buy goods or services."
          },
          {
            step: "Inventory",
            stepNote:
              "This will let you enter, update, inventory of items and prices of your catalog of good and services."
          },
          {
            step: "PO (Purchase Order)",
            stepNote:
              "This will enable you to purchase items, raise purchase orders (if needed), to fill your inventory."
          },
          {
            step: "Finance",
            stepNote:
              "This is your accounts payable and receivable. By default, it is set to receivable. For cash payments, your (creators) acceptance is accepted as received."
          }
        ],
        footnote:
          "This is your own market space (your business). Everything you need to do in your store is available here. If/when you want to request new functions, please head to your MyAccount and send Request Improvement to Baanda team."
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

  handleSelect = async choice => {
    // alert("The selection is: " + choice);
    if (choice === "profile") {
      await this.setState({
        profileEditFlag: true,
        pwdRestFlag: false
      });
    } else if (choice === "password") {
      await this.setState({
        profileEditFlag: false,
        pwdRestFlag: true
      });
    }
  };

  render() {
    console.log("profile this.props:", this.props);

    let profilebuttons = (
      <div>
        <div className="row">
          <div className="col-2 header_store_text1 text-center">Profile</div>
          <div className="col-10 header_store_buttons">
            <button
              className={`${
                !this.state.profileEditFlag ? "btn_profile" : "btn_profile_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("profile")}
            >
              <b>Profile</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.pwdRestFlag ? "btn_profile" : "btn_profile_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("password")}
            >
              <b>Password</b>
            </button>
            &nbsp;
            &nbsp;
            <button
              className="btn-modal-profile"
              type="button"
              onClick={this.openAlertModal}
            >
              <i className="fas fa-info-circle" />
            </button>
          </div>
        </div>
      </div>
    );

    let profilePanel;

    if (this.state.pwdRestFlag) {
      profilePanel = (
        <div>
          <ResetPassword
            goToDashboard={this.props.goToDashboard}
            role={this.props.role}
          />
        </div>
      );
    } else if (this.state.profileEditFlag) {
      profilePanel = <div><ProfileEdit /></div>;
    }

    return (
      <div>
        {profilebuttons}
        {profilePanel}
        <ModalContainer />
      </div>
    );
  }
}

Profile.propTypes = {
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
  )(Profile)
);
