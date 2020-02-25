import React, { Component, createRef } from "react";
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";

import "./EsigUtil.css";

// const sigCanvas = useRef({});

class EsigUtil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: null,
      setImageURL: null,

      showPopup: false,
      sigCanvas: createRef()
    };

    this.textInput = React.createRef();
  }

  togglePopup = async () => {
    await this.state({
      showPopup: !this.state.showPopup
    });
  };

  clear = () => {
    this.state.sigCanvas.current.clear();
  };

  save = async () => {
    await this.setState({
      imageURL: this.state.sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png")
    });
    this.props.callbackFromParent(this.state.imageURL);
  };

  goToContract = () => {
    // console.log("got into goToContract with = ", this.state.imageURL);
    this.props.callbackFromParent('cancel');
  };

//   someFn = () => {
//     this.props.callbackFromParent(this.state.imageURL);
//   };

  render() {
    // console.log("this.props:", this.props);

    let sigPanel;

    sigPanel = (
      <div>
        <Popup
          modal
          trigger={<button className="btn_sign_deal">Click-to-sign</button>}
          position="bottom center"
          closeOnDocumentClick={false}
        >
          {close => (
            <>
              <SignaturePad
                ref={this.state.sigCanvas}
                canvasProps={{
                  className: "signatureCanvas"
                }}
              />
              <button className="btn_esig" onClick={this.clear}>
                Clear
              </button>
              <button className="btn_esig" onClick={close}>
                Close
              </button>
              <button className="btn_esig" onClick={this.save}>
                Save
              </button>
            </>
          )}
        </Popup>
        <button onClick={this.goToContract} className="btn_sign_deal_red">Cancel</button>
      </div>
    );

    let outputPanel;

    outputPanel = <div>{sigPanel}</div>;

    return <div>{outputPanel}</div>;
  }
}

export default EsigUtil;
