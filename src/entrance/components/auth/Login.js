import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import queryString from "query-string";

import axios from "axios";
// import classnames from "classnames";
//import { Link } from 'react-router-dom';
// import { loginUser, googleLoginUser } from '../../../actions/authActions';
import { loginUser } from "../../../actions/authActions";

import { emailValidation } from "../../../utils/emailValidation";

import "./Login.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const resetPwdAndNotify = "/routes/users/resetPwdAndNotify";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      errors: {},

      forgotPwdFlag: false,

      errorMsg: "",
      errorFlag: false,

      opstype: "new",
      loginMsg: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  isObjEmpty = obj => {
    let len = Object.getOwnPropertyNames(obj).length;
    if (len > 0) return false;
    return true;
  };

  componentDidMount = async () => {
    // console.log('In login -- component did mount');
    const values = queryString.parse(this.props.location.search);
    console.log('Login onmount values:', values);
    await this.setState({
      loginMsg: localStorage.getItem("loginMsg")
    });
    if (!this.isObjEmpty(values)) {
      await this.setState({
        opstype: values.opstype,
        email: values.inviteeEmail
      });
    } else if (this.props.auth.isAuthenticated) {
      this.props.history.push("/lobby");
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('In login -- component will receive props');
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/lobby");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  async onChange(e) {
    await this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault(); // In form, we do not want to have default functions
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    // console.log("userData:", userData);
    this.props.loginUser(userData);
  }

  handleLogin = () => {
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    // console.log(user);
    this.props.loginUser(userData);
  };

  onClickGoogle(e) {
    e.preventDefault();
    // console.log('Got into Google Auth onclick function');
    this.props.googleLoginUser();
  }

  handleForgotPwdCheckbox = async () => {
    await this.setState(prevstate => ({
      forgotPwdFlag: !prevstate.forgotPwdFlag
    }));
    // console.log("this.state:", this.state);
  };

  handleForgotPwdBtn = async () => {
    // console.log('going to validation this.state.email:', this.state.email);
    let xx = emailValidation(this.state.email);
    // console.log('xx:', xx);

    if (!xx) {
      await this.setState({
        errorMsg: "Invalid email. Please check, fix and Reset.",
        errorFlag: true
      });
    } else {
      try {
        let url = baandaServer + resetPwdAndNotify;

        let inputData = {
          email: this.state.email
        };

        let reset = await axios.post(url, inputData);
        // console.log('reset:', reset, ' Msg:', );
        if (reset.data.status === "error") {
          await this.setState({
            errorMsg: reset.data.Msg,
            errorFlag: true
          });
        } else {
          await this.setState({
            errorMsg: reset.data.Msg,
            errorFlag: false
          });
        }

        // console.log('reset:', reset);
      } catch (err) {
        console.log("axios reset error:", err.message);
      }
    }
  };

  render() {
    // console.log("login this.state:", this.state);
    const { errors } = this.props;
    // console.log("Login js Errors:", errors);

    let forgotPwdCheckPanel;
    forgotPwdCheckPanel = (
      <div className="checkbox_div">
        <input
          type="checkbox"
          onChange={this.handleForgotPwdCheckbox}
          name="confirm"
        />{" "}
        Forgot password. Request Assistance.
      </div>
    );

    let buttonPanel;
    if (!this.state.forgotPwdFlag) {
      buttonPanel = (
        <div>
          <div className="row">
            <div className="col-8 text-center">{forgotPwdCheckPanel}</div>

            <div className="col-4 text-left">
              <button
                className="btn-login"
                type="button"
                onClick={this.handleLogin}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                Login&nbsp;
                <i className="fas fa-sign-in-alt" />
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      buttonPanel = (
        <div>
          <div className="row">
            <div className="col-8 text-center">{forgotPwdCheckPanel}</div>
            <div className="col-4 text-left">
              <button
                className="btn-login-forgot"
                type="button"
                onClick={this.handleForgotPwdBtn}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                Reset&nbsp;
                <i className="fas fa-exchange-alt" />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <p align="justify" className="reset-direction">
                Enter your email you used to register. You will receive an email
                on click/tap of the Reset button. Follow the instructions in
                email to login.
              </p>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
        </div>
      );
    }

    let loginPanel;
    loginPanel = (
      <div>
        <p className="top-padding" />
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="text-center"><h4>Login</h4></div>
              <div className="lead text-center">
                <h6>Sign into Baanda</h6>
              </div>
              <hr /><br />
              <div className="form-group">
                {this.state.opstype === "new" ? (
                  <div>
                    <input
                      type="email"
                      className="login_input"
                      placeholder="Email Address"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChange}
                      spellCheck="false"
                    />
                  </div>
                ) : (
                  <b>{this.state.email}</b>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="login_input"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <div className="textspaceTop" />
              <div className="textspaceTop" />
            </div>
          </div>
          {buttonPanel}
          {errors.emailConfirm && (
            <div className="text-danger text-center">
              <br />
              {errors.emailConfirm}
            </div>
          )}{" "}
          &nbsp;
          <div
            className={`${
              !this.state.errorFlag
                ? "reset-err-msg text-center"
                : "reset-msg text-center"
            }`}
          >
            {this.state.errorMsg}
          </div>
          <div className="row">
            <div className="col text-center login_msg">
              {this.state.loginMsg}
            </div>
          </div>
        </div>
      </div>
    );

    return <div className="login">{loginPanel}</div>;
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  // googleLoginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { loginUser })(Login));
