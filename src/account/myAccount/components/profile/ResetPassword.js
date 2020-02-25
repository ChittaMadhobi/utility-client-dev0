import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import axios from 'axios';

import { logoutUser } from "../../../../actions/authActions";

import "./ResetPassword.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const changePassword = "/routes/myaccount/changePassword";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPassword: "",
      newPassword1: "",
      newPassword2: "",
      messages: ""
    };
  }

  onChange = async e => {
    e.preventDefault();
    await this.setState({ [e.target.name]: e.target.value });
  };

  handleResetPassword = async () => {
    // alert("we validate & reset password here");
    try {
        let url = baandaServer + changePassword;
        let inputData = {
            email: this.props.auth.user.email,
            currentPwd: this.state.currentPassword,
            newPwd: this.state.newPassword1
        }  
        // console.log('inputData:', inputData);

        await axios.post(url, inputData);
        // console.log('resetPassword ret:', ret);
        this.props.logoutUser(this.props.history);
        this.props.history.push("/login");

    } catch(err) {

    }
  };

  render() {
    // console.log("ResetPawwrod props:", this.props);

    let resetPanel;

    resetPanel = (
      <div>
        <div className="reset_top_space" />
        <div className="text-center reset-header">Reset Your Password</div>
        {/* <div className="reset_top_space" /> */}
        <div className="row">
          <div className="col-5 text-right input_rows">Current Password</div>
          <div className="col-7 text-left input_rows">
            <input
              name="currentPassword"
              type="text"
              value={this.state.currentPassword}
              onChange={this.onChange}
              size="45"
              maxLength="40"
              className="input_password"
              //   placeholder="Your current password"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-5 text-right input_rows">New Password</div>
          <div className="col-7 text-left input_rows">
            <input
              name="newPassword1"
              type="text"
              value={this.state.newPassword1}
              onChange={this.onChange}
              size="45"
              maxLength="40"
              className="input_password"
              placeholder="New password"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-5 text-right input_rows">New Password</div>
          <div className="col-7 text-left input_rows">
            <input
              name="newPassword2"
              type="text"
              value={this.state.newPassword2}
              onChange={this.onChange}
              size="45"
              maxLength="40"
              className="input_password"
              placeholder="New password again"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-8 text-right reset_msgs">
            {this.state.messages}
          </div>
          <div className="col-4 text-center">
            <button
              className="btn_reset_save"
              type="button"
              onClick={this.handleResetPassword}
              //   style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Reset</b>&nbsp;
              <i className="fas fa-share-square" />
            </button>
          </div>
        </div>
      </div>
    );

    return <div>{resetPanel}</div>;
  }
}

ResetPassword.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(
    mapStateToProps,
    { logoutUser }
  )(ResetPassword)
);
