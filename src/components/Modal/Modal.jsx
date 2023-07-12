import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const ModalRoot = document.querySelector('#ModalRoot');

export default class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleOverlayClose = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    const { largeImageURL, tags } = this.props.image;
    return createPortal(
      <div onClick={this.handleOverlayClose} className={css.overlay}>
        <div className={css.modal}>
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>,
      ModalRoot
    );
  }
}

Modal.propTypes = {
  image: PropTypes.shape({
    largeImageURL: PropTypes.string,
    tags: PropTypes.string,
  }),
  onClose: PropTypes.func,
};
