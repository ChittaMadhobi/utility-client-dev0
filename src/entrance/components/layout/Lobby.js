/*
 **  Author: Jit (Sarbojit Mukherjee)
 **  Desc:   Provides the basic landing for Baanda with two opetions ... to chat with Baanda
 **          or login / signin to get to the lobby
 **  Note:   Every program and aspects of Baanda_dev, as of this day, is being coded and handled by Jit
 **  Date:   July 9, 2018
 **  Version:0.01
 */
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import "./Lobby.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getNewMessages = "/routes/interact/getNewMessages?";
const getAccessList = "/routes/dashboard/getAccessList?";

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboardFlag: true,
      isShowing: false,
      disabled: false,

      newMsgs: 0,
      newInvites: 0,
      newOpportunity: 0
    };

    this.openAlertModal = this.openAlertModal.bind(this);
  }
  UNSAFE_componentWillMount = () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  };

  // Get invites, Messages, and invites
  componentDidMount = async () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    // Make a DB call to get Messages

    // let params = "baandaId=" + this.props.auth.user.baandaId;
    // let url = baandaServer + getNewMessages + params;
    // // console.log('lobby componentDidMount url: ', url);
    // let urlaccess =
    //   baandaServer +
    //   getAccessList +
    //   "baandaid=" +
    //   this.props.auth.user.baandaId;

    // try {
    //   // call messages schama
    //   let newmsgs = await axios.get(url);
    //   // console.log("newmsgs:", newmsgs.data.Msg);
    //   // process newmsgs
    //   let newmsg = 0,
    //     newinv = 0,
    //     newopps = 0,
    //     isDash = false;
    //   if (newmsgs.data.Msg.length > 0) {
    //     let expr = "";
    //     newmsgs.data.Msg.forEach(elm => {
    //       expr = elm.msgType;
    //       switch (expr) {
    //         case "invite":
    //           newinv++;
    //           break;
    //         case "message":
    //           newmsg++;
    //           break;
    //         case "opportunity":
    //           newopps++;
    //           break;
    //         default:
    //           break;
    //       }
    //     });
    //   }
    //   // console.log('urlaccess:', urlaccess);

    //   let retAccess = await axios.get(urlaccess);
    //   // console.log('retAccess:', retAccess);
    //   if (retAccess.data.length > 0) {
    //     isDash = true;
    //   }
    //   // console.log("newmsg:", newmsg, " newinv:", newinv);
    //   await this.setState({
    //     newMsgs: newmsg,
    //     newInvites: newinv,
    //     newOpportunity: newopps,
    //     dashboardFlag: isDash
    //   });
    // } catch (err) {
    //   console.log("componentdidmount lobby err:", err.message);
    //   await this.setState({
    //     dashboardFlag: false
    //   });
    // }
  };

  openAlertModal = param => e => {
    // console.log('param : ' + param + ' user:' + this.props.auth.user.name)
    // let msg = 'This could be Jit ID: ' + param
    let msg = {
      Header: "This is start here header",
      Body: "This is start here body",
      Footer: "This is the footer"
    };
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: msg,
        closeModal: this.closeModal
      },
      "startHere"
    );
  };

  createTeamHandler = () => {
    // if (!this.props.auth.user.isInitDone) {
    //   // Create initial persona
    //   this.props.history.push("/userinitpersona");
    // } else
    if (!this.props.auth.user.isInitProfileDone) {
      // Create  initial profile
      this.props.history.push("/profilemgmt");
    } else {
      // Go and create/edit communities to author & publish
      this.props.history.push("/createcommunity");
    }
  };

  joinTeamHandler = () => {
    // if (!this.props.auth.user.isInitDone) {
    //   // Create initial persona
    //   this.props.history.push("/userinitpersona");
    // } else
    if (!this.props.auth.user.isInitProfileDone) {
      // Create  initial profile
      this.props.history.push("/profilemgmt");
    } else {
      // Go and create/edit communities to author & publish
      this.props.history.push("/joincommunity");
    }
  };

  dashboardHandler = () => {
    // Go to Dashboard (engage)
    this.props.history.push("/dashboard");
  };

  render() {
    // console.log('this.props: ', this.props);
    // let joinMsg = "2 Invites, 1 Match";
    // let joinMsg = "";
    // if (this.state.newMsgs > 0) {
    //   joinMsg = "Msgs: " + this.state.newMsgs + " ";
    // }
    // if (this.state.newInvites > 0) {
    //   joinMsg = "Invites: " + this.state.newInvites + " ";
    // }
    // if (this.state.newOpportunity) {
    //   joinMsg = "Opps: " + this.state.newOpportunity;
    // }
    // // let dashMsg = "3 New Messages";
    // // let joinMsg = "";
    // let dashMsg = "";

    // let teamUp = (
    //   <div className="domain-box">
    //     {" "}
    //     <div className="row">
    //       <div className="col text-center domain-box-header-text">
    //         Create Community - Team Up
    //       </div>
    //     </div>
    //     <div className="row">
    //       <div className="col panel_text">Co-op, Co-live & Co-serve</div>
    //     </div>
    //     <div className="space-between-domains" />
    //     <div className="row">
    //       <div className="col text-center domain-box-header-text">
    //         <button
    //           className="btn-lobby"
    //           type="button"
    //           onClick={this.createTeamHandler}
    //           style={{ cursor: this.state.disabled ? "default" : "pointer" }}
    //         >
    //           <b>Create</b>
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // );
    // let meetup = (
    //   <div className="domain-box">
    //     <div className="row">
    //       <div className="col text-center domain-box-header-text">
    //         Join Communities - Meet Up
    //       </div>
    //     </div>
    //     <div className="row">
    //       <div className="col panel_text">Search, Browse, Match & Connect</div>
    //     </div>
    //     <div className="space-between-domains" />
    //     <div className="row">
    //       <div className="col text-center domain-box-header-text">
    //         <button
    //           className="btn-lobby"
    //           type="button"
    //           onClick={this.joinTeamHandler}
    //           style={{ cursor: this.state.disabled ? "default" : "pointer" }}
    //         >
    //           <b>Join</b>
    //         </button>
    //       </div>
    //     </div>
    //     <div className="row">
    //       {/* <div className="col-7">&nbsp;</div> */}
    //       <div className="col joinMsg text-center">{joinMsg}</div>
    //       {/* <div className="col-1">&nbsp;</div> */}
    //     </div>
    //   </div>
    // );

    // let dashboard;
    // let spaceInbetween;
    // if (this.state.dashboardFlag) {
    //   dashboard = (
    //     <div className="domain-box">
    //       <div className="row">
    //         <div className="col text-center domain-box-header-text">
    //           Engage - The Dashboard
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col panel_text">
    //           Communicate, Reflect, Serve & more ...
    //         </div>
    //       </div>
    //       <div className="space-between-domains" />
    //       <div className="row">
    //         <div className="col text-center domain-box-header-text">
    //           <button
    //             className="btn-lobby"
    //             type="button"
    //             onClick={this.dashboardHandler}
    //             style={{ cursor: this.state.disabled ? "default" : "pointer" }}
    //           >
    //             <b>Engage</b>
    //           </button>
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="col-7">&nbsp;</div>
    //         <div className="col-4 joinMsg text-right">{dashMsg}</div>
    //         <div className="col-1">&nbsp;</div>
    //       </div>
    //     </div>
    //   );
    //   spaceInbetween = (
    //     <div>
    //       <div className="space-between-domains" />
    //     </div>
    //   );
    // } else {
    //   spaceInbetween = (
    //     <div>
    //       <div className="space-between-domains" />
    //       <div className="space-between-domains" />
    //       <div className="space-between-domains" />
    //       <div className="space-between-domains" />
    //       <div className="space-between-domains" />
    //       <div className="space-between-domains" />
    //     </div>
    //   );
    // }

    return (
      <div className="lobby">
        {/* <div className="lobbyheader"> */}
        {/* <div> */}
        <div className="row lobbyheader">
          <div className="col text-center banner-text">Better Together</div>
        </div>
        {/* </div> */}
        {/* {spaceInbetween}
        {teamUp}
        {spaceInbetween}
        {meetup}
        {spaceInbetween}
        {dashboard} */}
        <hr />
        <div className="col-12 text-center">
          <button
            className="btn-lobby-starthere"
            type="button"
            onClick={this.openAlertModal("tokenInput")}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Overview</b>
          </button>
        </div>
        <div className="bottom_spaces" />
        <ModalContainer />
      </div>
    );
  }
}

Lobby.propTypes = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));
