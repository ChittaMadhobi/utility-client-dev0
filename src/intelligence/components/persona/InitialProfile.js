import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "react-addons-update";
import ReactS3 from "react-s3";
import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import { postUserProfile } from "../../../actions/authActions";

import ReactLoading from "react-loading";
import cosmicDoorway from "../../../communityCreate/components/image/cosmicDoorway.jpg";

import "./InitialProfile.css";

const awsAccessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;
const awsRegion = process.env.REACT_APP_AWS_REGION;
const s3BucketName = process.env.REACT_APP_S3_BUCKET_NAME;
const s3DirName = process.env.REACT_APP_S3_DIRECTORY;

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getProfile = "/routes/myaccount/getProfile?";

class InitialProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preferredName: this.props.auth.user.name,
      formalName: "",
      geoLocation: "Hometown",
      preferredPronoun: "",
      editPanelFlag: true,
      reviewPanelFlag: false,
      buttonState: "review",
      message:
        "Fill your intro-profile. You can change it via navbar-> your account. ",
      valid: false,
      selfDescription: "",
      locationCurr: {},
      phone: "",

      // ==================================
      hightlight: false,
      currFilename: "",
      fileNameToDisplay: "",
      loadingFlag: false,
      saveReviewMsg: "",
      picturesMsg: "Please upload your selfi.",
      pictureErrFlag: false,
      fileUploads: [
        {
          contentType: "", // audio, video, pdf, pic
          bucket: "",
          dirname: "",
          key: "",
          caption: "",
          s3Url: ""
        }
      ],
      picCaption: "Selfi",
      latitude: 0,
      longitude: 0,
      street: "",
      city: "",
      postalCode: "",
      state: "CA",
      country: "USA"
      // ===================================
    };

    this.fileInputRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handlePronounChange = this.handlePronounChange.bind(this);
  }

  onFilesAdded = async evt => {
    let index;
    // pic=0, vedio=1, & audio=2 -- only three kinds now & pic is active.
    if (this.state.uploadFileType === "pic") {
      index = 0;
    } else if (this.state.uploadFileType === "vedio") {
      index = 1;
    } else {
      index = 2;
    }
    const files = evt.target.files;
    console.log("files:", evt.target.files);

    await this.setState({
      currFilename: files[index],
      fileNameToDisplay: "Ready to upload: " + files[index].name
    });
  };

  openFileDialog = async () => {
    console.log("1. this.fileInputRef: ", this.fileInputRef);
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
    // this.fileInputRef.current.click();
  };

  onDragOver = async evt => {
    evt.preventDefault();
    await this.setState({ hightlight: true });
  };

  onDragLeave = async () => {
    await this.setState({ hightlight: false });
  };

  onDrop = async event => {
    event.preventDefault();
    // console.log("this.props:", this.props);
    if (this.state.disabled) return; // investigate
    const files = event.dataTransfer.files;
    // console.log("files: ", files);
    await this.setState({
      hightlight: false,
      currFilename: files[0],
      fileNameToDisplay: "Ready to upload: " + files[0].name
    });
  };

  showPosition = async position => {
    // let lat = position.coords.latitude;
    await this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  };

  componentDidMount = async () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    let retdata;
    try {
      let gotipapidata = true;
      let url = "https://ipapi.co/json/";
      retdata = await axios.get(url);
      let rd = retdata.data;
      if (!retdata.data && retdata.data && !retdata.data.asn) {
        // throw new Error(
        //   "Geocentric return data not availabe for api = https://ipapi.co/json/"
        // );
        gotipapidata = false;
      }
      console.log("retData.data:", retdata.data);
      let lat = 0,
        lon = 0;
      if (this.state.latitude) {
        lat = this.state.latitude;
        lon = this.state.longitude;
      } else {
        lat = rd.latitude;
        lon = rd.longitude;
      }
      let geodata = {};
      if (gotipapidata) {
        geodata = {
          city: rd.city,
          country: rd.country,
          country_calling_code: rd.country_calling_code,
          country_name: rd.country_name,
          currency: rd.currency,
          in_eu: rd.in_eu,
          ip: rd.ip,
          language: rd.language,
          latitude: lat,
          longitude: lon,
          org: rd.org,
          postal: rd.postal,
          region: rd.region,
          region_code: rd.region_code,
          timezone: rd.timezone,
          utc_offset: rd.utc_offset
        };
      } else {
        geodata = {
          city: "",
          country: "",
          country_calling_code: "",
          country_name: "",
          currency: "",
          in_eu: "",
          ip: "",
          language: "",
          latitude: lat,
          longitude: lon,
          org: "",
          postal: "",
          region: "",
          region_code: "",
          timezone: "",
          utc_offset: ""
        };
      }
      console.log("InitialProfile geodata:", geodata);
      await this.setState({
        locationCurr: geodata
      });
      this.initializeProfile();
    } catch (err) {
      console.log("err:", err.message);
    }
    // console.log("retdata: ", retdata);
  };

  setUploadType = async type => {
    console.log("setUploadType type:", type);
    await this.setState({
      uploadFileType: type,
      uploadBtnClicked: true,
      uploadMsg: "Click / Tap File Dropzone, or Drag'n-Drop."
    });
  };

  initializeProfile = async () => {
    try {
      let param = "email=" + this.props.auth.user.email;
      let url = baandaServer + getProfile + param;
      // console.log("url:", url);
      let getprofile = await axios.get(url); 
      // console.log("getprofile:", getprofile);
      let obj0 = getprofile.data.Msg;
      // console.log(">>>>>>>>>>>> obj0:", obj0);
      let geoLoc;
      if (obj0.geoLocation === "") {
        geoLoc = "Hometown";
      } else {
        geoLoc = obj0.geoLocation;
      }

      let fu = {
        contentType: obj0.fileUploads.type,
        bucket: s3BucketName,
        dirName: s3DirName,
        key: obj0.fileUploads.key,
        caption: obj0.fileUploads.caption,
        s3Url: obj0.fileUploads.s3Url
      };

      let prefName = this.state.preferredName;
      if (obj0.preferredName && obj0.preferredName.length > 0) {
        prefName = obj0.preferredName;
      }

      await this.setState({
        preferredName: prefName,
        formalName: obj0.formalName,
        selfDescription: obj0.selfDescription,
        geoLocation: geoLoc,
        preferredPronoun: obj0.preferredPronoun,
        // locationCurr: obj0.geoCentricInfo,
        phone: obj0.cell.number,
        fileUploads: [fu],
        street: obj0.address.street,
        city: obj0.address.city,
        postalCode: obj0.address.postalCode,
        state: obj0.address.state,
        country: obj0.address.country
      });
    } catch (err) {}
  };

  onChange(e) {
    // console.log('onChange: ', e.target.name, ' value:', e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLocationChange(e) {
    this.setState({
      geoLocation: e.target.value
    });
  }

  handlePronounChange(e) {
    this.setState({
      preferredPronoun: e.target.value
    });
  }

  onReview = async () => {
    let msg = this.validate();
    // console.log('msg:', msg, ' this.state 1:', this.state);
    if (!msg.status) {
      await this.setState({
        editPanelFlag: true,
        reviewPanelFlag: false,
        buttonState: "review",
        message: msg.text
      });
    } else {
      await this.setState({
        editPanelFlag: false,
        reviewPanelFlag: true,
        buttonState: "save",
        message: msg.text
      });
    }
  };

  onSubmit(e) {
    e.preventDefault();

    let fileUpload = {
      key: this.state.fileUploads[0].key,
      type: this.state.fileUploads[0].contentType,
      s3Url: this.state.fileUploads[0].s3Url,
      caption: this.state.picCaption
    };

    let address = {
      street: this.state.street,
      city: this.state.city,
      postalCode: this.state.postalCode,
      state: this.state.state,
      country: this.state.country
    };

    let data = {
      user: this.props.auth.user,
      profile: {
        preferredName: this.state.preferredName,
        formalName: this.state.formalName,
        selfDescription: this.state.selfDescription,
        geoLocation: this.state.geoLocation,
        preferredPronoun: this.state.preferredPronoun,
        locationCurr: this.state.locationCurr,
        cell: this.state.phone,
        fileUpload: fileUpload,
        address: address
      }
    };
    console.log("input data: ", data);
    this.props.postUserProfile(data);
    this.props.history.push("/lobby");
  }

  onEdit = async () => {
    await this.setState({
      editPanelFlag: true,
      reviewPanelFlag: false,
      buttonState: "review",
      message: "Please edit, review and save if satisfied."
    });
  };

  validate = () => {
    console.log("validate  this.state:", this.state);
    let errMsg = "";
    let state = true;
    if (this.state.preferredName.trim().length < 5) {
      errMsg = errMsg + "Must have a name 5 to 40 chars. ";
      state = false;
    }

    let sd = this.state.selfDescription.length;
    if (sd > 0 && this.state.selfDescription.trim().length < 10) {
      errMsg =
        errMsg +
        "Self Description should me at least 10 chars (you have used " +
        this.state.selfDescription.trim().length +
        "). ";
      state = false;
    }

    if (this.state.preferredPronoun === "") {
      errMsg = errMsg + "Specify your gender identity. ";
      state = false;
    }

    let msg = { status: state, text: errMsg };
    return msg;
  };

  uploadToS3 = async e => {
    // alert("uploading to s3 begings");
    await this.setState({
      loadingFlag: true
    });

    let config = {
      bucketName: s3BucketName,
      dirName: s3DirName,
      region: awsRegion,
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey
    };
    // console.log("Uplading file: ", this.state.currFilename);
    console.log("AWS S3 config: ", config);
    // let index;
    // // pic=0, vedio=1, & audio=2 -- only three kinds now & pic is active.
    // if (this.state.uploadFileType === "pic") {
    //   index = 0;
    // } else if (this.state.uploadFileType === "vedio") {
    //   index = 1;
    // } else {
    //   index = 2;
    // }
    // console.log("index :", index);

    try {
      let data = await ReactS3.uploadFile(this.state.currFilename, config);
      let s3fileObject = {
        contentType: this.state.uploadFileType,
        bucket: data.bucket,
        dirname: s3DirName,
        key: data.key,
        caption: "Selfi",
        s3Url: data.location
      };
      let filename;
      if (s3fileObject.key) {
        filename = s3fileObject.key.split(/(\\|\/)/g).pop();
      }
      console.log("Data:", data, " s3fileObject:", s3fileObject);
      // this.setState(prevState => ({
      //   fileUploads: {
      //     ...prevState.fileUploads, [prevState.fileUploads[index]]: s3fileObject
      //   }
      // }))
      await this.setState({
        fileUploads: update(this.state.fileUploads, {
          0: { $set: s3fileObject }
        }),
        loadingFlag: false,
        fileNameToDisplay: filename + " successfully upload",
        saveReviewMsg: "File uploaded. Please Review and Save when ready."
      });
    } catch (err) {
      console.log("uploadng Error:", err);
      await this.setState({
        fileUploads: null,
        loadingFlag: false,
        fileNameToDisplay: "Failed to upload successfully",
        saveReviewMsg:
          "Error: Contact Baanda support jit@baanda.com with error: " +
          err.message
      });
    }
  };

  render() {
    // console.log("this.props:", this.props.auth.user);
    console.log("this.state:", this.state);

    let uploadingSpin;
    if (this.state.loadingFlag) {
      uploadingSpin = (
        <div>
          <ReactLoading
            type={"spokes"}
            color={"#195670"}
            height={30}
            width={30}
          />
        </div>
      );
    } else {
      uploadingSpin = null;
    }
    // let preferredNameMsg = "Name others will see. Max length 40.";
    let fileLoadBtn;
    fileLoadBtn = (
      <div className="file_load_btn_positions">
        <span>
          <b>Upload Selfis:</b>&nbsp;
          <button
            className="btn-upload-active"
            type="button"
            onClick={() => this.setUploadType("pic")}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Picture</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-inactive"
            type="button"
            onClick={() => this.setUploadType("vedio")}
            disabled
          >
            <b>Video</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-inactive"
            type="button"
            onClick={() => this.setUploadType("audio")}
            disabled
          >
            <b>Audio</b>
          </button>
        </span>
        {/* <p className="text-center picture_msg">{this.state.uploadDirection}</p> */}
        <div
          className={`${
            !this.state.uploadErrFlag
              ? "picture_msg text-center"
              : "picture_msg_err text-center"
          }`}
        >
          {/* {this.state.uploadDirection} */}
        </div>
      </div>
    );

    let uploadpanel;
    if (this.state.uploadBtnClicked) {
      uploadpanel = (
        <div>
          <div className="row">
            <div className="col-6">
              <div
                className={`dropzone-pro ${
                  this.state.highlight ? "highlight-pro" : ""
                }`}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                <p className="text-center top_of_card">Selfi Dropzone</p>
                <img alt="upload" className="icon-pro" src={cosmicDoorway} />
                <input
                  ref={this.fileInputRef}
                  className="fileInput-pro"
                  type="file"
                  multiple
                  onChange={this.onFilesAdded}
                />
              </div>
            </div>
            <div className="col-6 text-center upload_message_pro">
              <p>{this.state.uploadMsg}</p>
              <p className="pic_caption_msg-pro">
                <b>{this.state.fileNameToDisplay}</b>
              </p>
              <button
                className="btn_load_to_cloud_pro"
                type="button"
                onClick={this.uploadToS3}
                style={{
                  cursor: this.state.disabled ? "default" : "pointer"
                }}
              >
                <b>Upload</b>
              </button>
              <div>{uploadingSpin}</div>
            </div>
          </div>
          <div
            className={`${
              !this.state.pictureErrFlag
                ? "save_review_msg_pro pic_msg_placement_pro"
                : "save_review_msg_pro_err pic_msg_placement_pro"
            }`}
          >
            <p>{this.state.picturesMsg}</p>
          </div>
        </div>
      );
    }

    let submitButtons;
    if (this.state.buttonState === "review") {
      submitButtons = (
        <div>
          <button
            className="btn-submit_initprofile"
            type="button"
            onClick={this.onReview}
          >
            <b>Review</b>
          </button>
        </div>
      );
    } else {
      submitButtons = (
        <div>
          <button
            className="btn-save-edit"
            type="button"
            onClick={this.onSubmit}
          >
            <b>Save</b>
          </button>{" "}
          &nbsp;
          <button className="btn-save-edit" type="button" onClick={this.onEdit}>
            <b>Edit</b>
          </button>
          <div className="buffer_below" />
          <hr />
        </div>
      );
    }

    // let geolocationpanel;
    // if (this.state.geoLocation === 'currentLocation') {
    let geolocationpanel = (
      <div>
        <div className="row">
          <div className="col review-text">
            <font color="#1c799e">
              <p align="justify">
                Following is your current geo-location. You can change this via
                MyAccount edit profile at anytime. Your community's geo-center
                could be different.{" "}
              </p>
            </font>
          </div>
        </div>
        <div className="row">
          <div className="col review-text">
            <p align="justify">
              <b>City:</b>&nbsp;{this.state.locationCurr.city}
            </p>
            <p align="justify">
              <b>Postal Code (ZIP):</b>&nbsp;{this.state.locationCurr.postal}
            </p>
            <p align="justify">
              <b>State:</b>&nbsp;{this.state.locationCurr.region}
            </p>
            <p align="justify">
              <b>Country:</b>&nbsp;{this.state.locationCurr.country_name}
            </p>
            <p align="justify">
              <b>Language:</b>&nbsp;English
            </p>
            <p align="justify">
              <b>Currency:</b>&nbsp;{this.state.locationCurr.currency}
            </p>
            <p align="justify">
              <b>Timezone:</b>&nbsp;{this.state.locationCurr.timezone}
            </p>
            <p align="justify">
              <b>Offset from GMT (now):</b>&nbsp;
              {this.state.locationCurr.utc_offset}&nbsp;hours
            </p>
            <p align="justify">
              <b>Latitude:</b>&nbsp;{this.state.locationCurr.latitude}&nbsp;
            </p>
            <p align="justify">
              <b>Longitude:</b>&nbsp;{this.state.locationCurr.longitude}&nbsp;
            </p>

            <p align="justify">
              <b>Carrier Org:</b>&nbsp;{this.state.locationCurr.org}
            </p>
          </div>
        </div>
      </div>
    );
    // }

    let geocentricNote;
    if (this.state.geoLocation === "Hometown") {
      console.log("In hometown");
      geocentricNote = (
        <div className="geo-position">
          <font color="#1d7010">
            <p align="justify">
              <b>Geocentric Note:</b> You have indicated you are now at your
              hometown. The information will be used to provide geocentric
              intelligence.
            </p>
          </font>
        </div>
      );
    } else {
      geocentricNote = (
        <div className="geo-position">
          <font color="#104270">
            <p align="justify">
              <b>Geocentric Note:</b> You have indicated you are now NOT at your
              hometown. You can fix it by going to MyAccount and edit profile
              when you are in your home town. This is for providing geocentric
              intelligence.
            </p>
          </font>
        </div>
      );
    }

    let addressPanel;
    addressPanel = (
      <div>
        <div className="row">
          <div className="col-md-6 address-text">
            <input
              name="street"
              type="text"
              value={this.state.street}
              onChange={this.onChange}
              size="45"
              maxLength="60"
              className="addr-street-city"
              placeholder="Your residence street address"
            />
            <small>
              <p>Your residence street address</p>
            </small>
          </div>
          <div className="col-md-6 address-text">
            <input
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.onChange}
              size="45"
              maxLength="60"
              className="addr-street-city"
              placeholder="Your residence street address"
            />
            <small>
              <p>Your residence city name</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-3 address-text">
            <input
              name="postalCode"
              type="number"
              value={this.state.postalCode}
              onChange={this.onChange}
              size="10"
              maxLength="5"
              className="addr-zip"
              placeholder="ZIP"
            />
            <small>
              <p>Zip</p>
            </small>
          </div>
          <div className="col-1">&nbsp;</div>
          <div className="col-2 address-text">
            <input
              name="state"
              type="text"
              value={this.state.state}
              onChange={this.onChange}
              className="addr-state"
              size="2"
              maxLength="2"
            />
            <small>
              <p>State </p>
            </small>
          </div>
          <div className="col-1">&nbsp;</div>
          <div className="col-5 address-text">
            <input
              name="country"
              type="text"
              value={this.state.country}
              onChange={this.onChange}
              className="addr-country"
              size="45"
              maxLength="60"
            />
            <small>
              <p>Country </p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col text-center address-msg">
            Address is used for geo-intel based suggestions & matches.
          </div>
        </div>
      </div>
    );

    let showPanel;
    if (this.state.editPanelFlag) {
      showPanel = (
        <div>
          <div className="row text-center">
            <div className="col header_text_prof">Author Your Profile</div>
            {/* <div className="col-6">&nbsp;</div> */}
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 text-center">
              <input
                name="preferredName"
                type="text"
                value={this.state.preferredName}
                onChange={this.onChange}
                size="45"
                maxLength="40"
                className="prof-name"
              />
              <small>
                <p>Name others will see; 5 to 40 Chars long.</p>
              </small>
            </div>
            <div className="col-md-6 text-center">
              <input
                name="formalName"
                type="text"
                value={this.state.formalName}
                onChange={this.onChange}
                size="45"
                className="prof-name"
              />
              <small>
                <p>Your formal/official name (optional)</p>
              </small>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <textarea
                name="selfDescription"
                maxLength="500"
                placeholder="Write short something about how you feel about your life NOW. No one will see it except me (Baanda)."
                rows="4"
                wrap="hard"
                spellCheck="true"
                onChange={this.onChange}
                value={this.state.selfDescription}
                className="self-description"
                required
              />
              <small>
                <p>** Describe your "self" - (min:50 max:500 chars)</p>
              </small>
            </div>
          </div>
          {addressPanel}
          <div className="row geo-position">
            <div className="col-md-6 text-center">
              <strong>Current location: &nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Hometown"
                    checked={this.state.geoLocation === "Hometown"}
                    onChange={this.handleLocationChange}
                  />{" "}
                  Hometown
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Elsewhere"
                    checked={this.state.geoLocation === "Elsewhere"}
                    onChange={this.handleLocationChange}
                  />{" "}
                  Elsewhere
                </label>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <strong>Pronoun Preferred:&nbsp;&nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="She"
                    checked={this.state.preferredPronoun === "She"}
                    onChange={this.handlePronounChange}
                  />{" "}
                  She
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="He"
                    checked={this.state.preferredPronoun === "He"}
                    onChange={this.handlePronounChange}
                  />{" "}
                  He
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <PhoneInput
                placeholder="Enter Cell number"
                value={this.state.phone}
                onChange={phone => this.setState({ phone })}
                country="US"
                className="phoneFlag"
              />
            </div>
            <div className="col-md-6">
              <small>
                <p align="justify message_text">
                  For notification only; can block selectively & contextually.{" "}
                </p>
              </small>
            </div>
          </div>
          <div className="row">
            <div className="col">{fileLoadBtn}</div>
          </div>
          <div>{uploadpanel}</div>
          <hr />
          <div className="row">
            <div className="col-8 message_text">
              <p>{this.state.message}</p>
            </div>
            <div className="col-4">{submitButtons}</div>
          </div>
        </div>
      );
    }

    let imgSrc, imgCaption;
    if (this.state.fileUploads[0].s3Url) {
      imgSrc = this.state.fileUploads[0].s3Url;
      imgCaption = this.state.picCaption;
    }

    let picPanel;
    if (!imgSrc) {
      picPanel = (
        <div>
          <p className="text-center top_of_card_rev">{imgCaption}</p>
          <font color="red">
            <p>No picture has been uploaded</p>
          </font>
        </div>
      );
    } else {
      picPanel = (
        <div>
          <p className="text-center top_of_card_rev">{imgCaption}</p>
          <img alt="upload" className="icon_rev" src={imgSrc} />
        </div>
      );
    }

    if (this.state.reviewPanelFlag) {
      showPanel = (
        <div>
          <div className="row text-center">
            <div className="col header_text_prof">Review Your Profile</div>
          </div>
          <div className="row">
            <div className="col review-text">
              <b>Preferred:</b>&nbsp; {this.state.preferredName}
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <b>Formal:</b>&nbsp;{this.state.formalName}
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Self Description:</b>&nbsp; {this.state.selfDescription}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Gender Identity:</b>&nbsp; {this.state.preferredPronoun}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p>
                <b>Address:</b>&nbsp; {this.state.street}<br/>&nbsp;{this.state.city},&nbsp;{this.state.state}&nbsp;{this.state.postalCode},&nbsp;{this.state.country} 
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Cell:</b>&nbsp; {this.state.phone}
              </p>
            </div>
          </div>
          <div>{geolocationpanel}</div>
          <div>{geocentricNote}</div>
          <div className="row">
            <div className="col">
              <div className="picture_review_card_pro">{picPanel}</div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-8 message_text">
              <p>{this.state.message}</p>
            </div>
            <div className="col-4">{submitButtons}</div>
          </div>
          <div className="spacing_below" />
        </div>
      );
    }

    return (
      <div>
        <div className="fixedsize_initProfile">
          {/* <h3>This is InitialProfile ZZZ</h3> */}
          {showPanel}
        </div>
        <div className="spacing_below" />
        <ModalContainer />
      </div>
    );
  }
}

InitialProfile.propTypes = {
  postUserProfile: PropTypes.func.isRequired,
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
  },
  postUserProfile: val => {
    dispatch(postUserProfile(val));
  }
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InitialProfile)
);
