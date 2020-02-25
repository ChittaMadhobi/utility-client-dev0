import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom"; // We need this to redirect from authActions
import classnames from "classnames";
import { connect } from "react-redux";
import queryString from "query-string";

import "./Register.css";

import { registerUser } from "../../../actions/authActions";

class Register extends Component {
  // This deals with component state here.
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      opstype: "new",
      communityId: 0,
      subject: "",

      registeredFlag: false,
      registerMsg: "Enter registration information.",

      enteringFlag: false
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
    const values = queryString.parse(this.props.location.search);
    // console.log("Login -------->>> values:", values);

    if (!this.isObjEmpty(values)) {
      await this.setState({
        opstype: values.opstype,
        email: values.inviteeEmail,
        communityId: values.communityId,
        subject: values.subject
      });
    } else if (this.props.auth.isAuthenticated) {
      this.props.history.push("/lobby");
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      // here we are loading component' state with the application property returned
    }
  }

  async onChange(e) {
    await this.setState({
      [e.target.name]: e.target.value,
      enteringFlag: true
    });
  }

  async onSubmit(e) {
    e.preventDefault(); // In form, we do not want to have default functions
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      opstype: this.state.opstype,
      communityId: this.state.communityId,
      subject: this.state.subject
    };

    // console.log("props.auth.message 1:", this.props.auth.message);
    await this.props.registerUser(newUser, this.props.history);
    // 2nd parm enable redirection from actions. We are not using it here.
    // console.log("xx Register this.props:", this.props);
    // if (!this.props.auth.isAuthenticated) {
    await this.setState({
      registeredFlag: false,
      registerMsg: "Please confirm your email to login",
      name: this.state.name,
      email: this.state.email,
      password: "",
      password2: "",
      enteringFlag: false
    });

    if (this.props.errors.email) {
      console.log("Let us see if this works");
    }

    console.log(">>>>>>>>>>>> this.props:", this.props);
    // } else {
    await this.setState({
      registerMsg: "Please confirm your mail to login."
    });

    // if ( this.state.registeredFlag ) {
      localStorage.removeItem('loginMsg');
      localStorage.setItem('loginMsg', 'Registered sucessfully.')
    //   this.props.history.push("/lobby");
    // }
  }

  render() {
    const { errors } = this.props;
    // console.log("Register props:", this.props);
    // console.log("Errors:", errors);

    let msg;
    let errFlg = true;
    let eremail;

    let abcd = errors.email;
    if (!errors.email) {
      msg = this.state.registerMsg;
      eremail = "";
    } else {
      msg = "Correct errors and re-submit";
      errFlg = false;
      eremail = errors.email;
    }

    if (this.state.enteringFlag) {
      eremail = "";
      msg = "Enter correct information to register.";
      errFlg = true;
      abcd = "";
    }

    // console.log("2 eremail:", eremail);
    // console.log('msg:', msg, ' this.props.auth.user.message:', this.props.auth.user.message);

    let formPanel;

    if (!this.state.registeredFlag) {
      formPanel = (
        <div>
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="text-center">
                <h4>Sign Up</h4>
              </div>
              <div className="lead text-center">
                <h6>Create your Baanda account</h6>
              </div>
              <hr /><br />
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control ", {
                      "is-invalid": errors.name
                    })}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  {this.state.opstype === "new" ? (
                    <div>
                      <input
                        type="email"
                        className={classnames("form-control ", {
                          "is-invalid": abcd
                        })}
                        placeholder="Email Address"
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                      <small className="form-text text-muted">
                        Uses Gravatar email or upload picture in your profile
                        later.
                      </small>
                    </div>
                  ) : (
                    <b>{this.state.email}</b>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control ", {
                      "is-invalid": errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control ", {
                      "is-invalid": errors.password2
                    })}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
                <div className="text-center">
                  <button className="btn_register" type="submit">
                    <b>Submit</b>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div
              className={`${
                errFlg
                  ? "col text-center reg-msg"
                  : "col text-center reg-msg-err"
              }`}
            >
              {msg}
            </div>
          </div>
        </div>
      );
    } else {
      formPanel = (
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <p className="text-center h6 text-muted">{msg}</p>
        </div>
      );
    }

    return (
      <div className="register">
        <p className="top-padding" />
        <div className="container">{formPanel}</div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
  // message: PropTypes.object
};

// If we want any of the return values into our component then we have to create
const mapStateToProps = state => ({
  auth: state.auth, // This allow us to access via this.props.auth.(fields in it)
  // the first auth (auth:) is whatever we want.  The 'auth' in state.auth is the
  // the value defined in the root reducer which is in reducer/index.js
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register)); // Wrapt with 'withRouder' to enable redirect from actions, such as ... authActions.
