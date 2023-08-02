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
    prevFilter: '',
    error: null,
    pictures: [],
    page: 1,
    pictureId: null,
    showModal: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.filter !== this.state.filter) {
      this.setState({
        pictures: [],
        page: 1,
      });
    }
  }

  fetchData = async e => {
    if (e) {
      e.preventDefault();
    }
    const { filter, page, prevFilter } = this.state;
    this.setState({ isLoading: true });

    try {
      if (filter && filter === prevFilter) {
        this.setState(prevState => ({
          pictures: [...prevState.pictures],
        }));
      }
      if (filter && filter !== prevFilter) {
        const pictures = await fetchGallery(filter, page);
        if (pictures.length === 0) {
          Notify.failure('Sorry, no images for your request :(');
        }
        this.setState(prevState => ({
          pictures: [...prevState.pictures, ...pictures],
          prevFilter: filter,
        }));
      }
      if (filter === '') {
        Notify.failure('Please type something!');
      }
    } catch (error) {
      this.setState({ isError: true, error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  addMorePages = async () => {
    const { filter, page } = this.state;

    this.setState(prevState => ({ page: prevState.page + 1, isLoading: true }));
    try {
      const pictures = await fetchGallery(filter, page + 1);
      this.setState(prevState => ({
        pictures: [...prevState.pictures, ...pictures],
        // page: prevState.page + 1
      }));
    } catch (error) {
      this.setState({ isError: true, error });
    } finally {
      this.setState({ isLoading: false });
    }
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
        <Searchbar onChange={this.onChangeInput} onSubmit={this.fetchData} />
        
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
