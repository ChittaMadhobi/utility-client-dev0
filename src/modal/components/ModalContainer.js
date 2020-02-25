import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

//import { default as modalTypes } from '../../entrance/components/modals';
import { default as modalTypes } from './index';

const MODAL_TYPES = {
  startHere: modalTypes.alertModalRcc,
  infoModal: modalTypes.infoModalRcc,
  invoiceReportModal: modalTypes.invoiceReportRcc,
  chartsModal: modalTypes.chartsRcc, 
  presentModal: modalTypes.showPdfRcc
};

const mapStateToProps = state => ({
  ...state.modal
});

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        modalIsOpen: nextProps.modalProps.open
      });
    }
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    if (!this.props.modalType) {
      return null;
    }
    const SpecifiedModal = MODAL_TYPES[this.props.modalType];
    // console.log('SpecifiedModal(props):' + JSON.stringify(this.props));
    return (
      <div>
        <ReactModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}
          contentLabel="Example Modal"
          ariaHideApp={false}
          overlayClassName="modal fade show"
          bodyOpenClassName="modal-open-z"
          className="modal-dialog-z modal-dialog-centered-z"
        >
          <SpecifiedModal
            closeModal={this.closeModal}
            {...this.props.modalProps}
          />
        </ReactModal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(ModalContainer);
