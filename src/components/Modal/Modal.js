import { createPortal } from 'react-dom';
import { Component } from 'react';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends Component {
  state = {
    pictureLink: null,
    pictureAlt: '',
  };

  componentDidMount() {
    const { pictures, id } = this.props;
    const foundPicture = pictures.find(picture => picture.id === id);
    if (foundPicture) {
      this.setState({ 
        pictureLink: foundPicture.largeImageURL,
        pictureAlt: foundPicture.tags,
       });
    }

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

  handleModalClick = e => {
    const backdrop = document.querySelector('#backdrop');
    if (e.target === backdrop) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <div
        id="backdrop"
        className={css.overlay}
        onClick={this.handleModalClick}
      >
        <div id="modal" className={css.modal}>
          {this.state.pictureLink && (
            <img src={this.state.pictureLink} alt={this.state.pictureAlt} />
          )}
        </div>
      </div>,
      modalRoot
    );
  }
}
