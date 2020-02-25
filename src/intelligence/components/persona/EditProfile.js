// import React, { Component } from "react";
// import { PropTypes } from "prop-types";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// // import ReactDOM from 'react-dom';
// // import axios from "axios";
// import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";

// // import { postUserProfile } from '../../../actions/authActions';
// import { postUserProfile } from "../../../actions/authActions";

// // import ModalContainer from "../../../modal/components/ModalContainer";
// // import { showModal, hideModal } from "../../../actions/modalActions";
// // import "../../../modal/css/localModal.css";
// // import "../../../modal/css/template.css";

// class EditProfile extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       name: ""
//     };
//   }

//   async componentDidMount() {
//     if (!this.props.auth.isAuthenticated) {
//       this.props.history.push("/login");
//     }
//     let retdata;
//     try {
//       let url = "https://ipapi.co/json/";
//       retdata = await axios.get(url);
//       if (!retdata.data) {
//         throw new Error(
//           "Geocentric return data not availabe for api = https://ipapi.co/json/"
//         );
//       } else {
//         this.setState({
//           locationCurr: retdata.data
//         });
//       }
//       // console.log("retdata:", retdata.data);
//     } catch (err) {
//       console.log("Get geodata error:", err);
//     }
//   }

//   // componentWillUnmount() {
//   //   this.props.history.goForward();
//   // }

//   onChange(e) {
//     // console.log('onChange: ', e.target.name, ' value:', e.target.value);
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   handleLocationChange(e) {
//     this.setState({
//       geoLocation: e.target.value
//     });
//   }

//   handlePronounChange(e) {
//     this.setState({
//       preferredPronoun: e.target.value
//     });
//   }

//   render() {
//     return <div>Editing Profile</div>;
//   }
// }

// EditProfile.propTypes = {
//   postUserProfile: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   auth: state.auth
// });

// const mapDispatchToProps = dispatch => ({
//   hideModal: () => dispatch(hideModal()),
//   showModal: (modalProps, modalType) => {
//     // console.log(
//     //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
//     // );
//     dispatch(showModal({ modalProps, modalType }));
//   },
//   postUserProfile: val => {
//     dispatch(postUserProfile(val));
//   }
// });

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(EditProfile)
// );
