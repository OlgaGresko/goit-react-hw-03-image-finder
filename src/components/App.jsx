import { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchGallery from 'services/api';
import { Notify } from 'notiflix';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

const PER_PAGE = '12';

export default class App extends Component {
  state = {
    isLoading: false,
    isError: false,
    filter: '',
    error: null,
    pictures: [],
    page: 1,
    pictureId: null,
    showModal: false,
  };

  async componentDidUpdate(_, prevState) {
    if (prevState.filter !== this.state.filter) {
      try {
        const response = await fetchGallery(this.state.filter, this.state.page);
        if (response.length === 0) {
          Notify.failure('Sorry, no images for your request :(');
        }
        this.setState({
          pictures: response,
          isLoading: false,
        });
      } catch (error) {
        this.setState({
          isError: error.message,
        });
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
    if (
      prevState.filter === this.state.filter &&
      prevState.page !== this.state.page
    ) {
      try {
        const response = await fetchGallery(this.state.filter, this.state.page);
        this.setState({
          pictures: [...prevState.pictures, ...response],
          isLoading: false,
        });
      } catch (error) {
        this.setState({
          isError: error.message,
        });
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    const inputValue = e.currentTarget.elements.query.value;
    if (inputValue === '') {
      Notify.failure('Please type something!');
      this.setState({ isLoading: false });
      return;
    }
    this.setState({
      isLoading: true,
      pictures: [],
      filter: inputValue,
      page: 1,
    });
  };

  addMorePages = async () => {
    this.setState(prevState => ({ page: prevState.page + 1, isLoading: true }));
  };

  toggleModal = id => {
    this.setState({
      pictureId: id,
    });
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
    if (!this.state.showModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  onChangeInput = e => {
    this.setState({
      filter: e.target.value.toLowerCase().trim(),
    });
  };

  render() {
    const { pictures, isLoading, showModal, pictureId } = this.state;

    return (
      <div
        style={{
          height: '100vh',
          display: 'grid',
          alignContent: 'start',
          gridTemplateColumns: '1fr',
          gridGap: 16,
          paddingBottom: 24,
          fontSize: 40,
          color: '#010101',
        }}
      >
        <Searchbar onSubmit={this.handleSubmit} />

        <ImageGallery
          pictures={this.state.pictures}
          toggleModal={this.toggleModal}
        />
        {isLoading && <Loader />}
        {pictures.length >= PER_PAGE && pictures.length % PER_PAGE === 0 && (
          <Button onClick={this.addMorePages} />
        )}
        {showModal && (
          <Modal
            pictures={pictures}
            id={pictureId}
            onClose={this.toggleModal}
            showModal={this.state.showModal}
          />
        )}
      </div>
    );
  }
}
