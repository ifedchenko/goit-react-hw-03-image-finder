import React, { Component } from 'react';
import Notiflix from 'notiflix';
import Searchbar from './Searchbar/Searchbar';
import { fetchImages } from './services/image-api';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';

let page = 1;

export class App extends Component {
  state = {
    query: '',
    items: [],
    status: 'idle',
    totalHits: 0,
  };

  onSubmit = async query => {
    // page = 1;
    if (query.trim() === '') {
      Notiflix.Notify.info('You cannot search by an empty field, try again.');
      return;
    } else if (query.trim() === this.state.query) {
      Notiflix.Notify.info(`You already searched for "${query}", try again.`);
      return;
    } else {
      try {
        this.setState({ status: 'pending' });
        const { totalHits, hits } = await fetchImages(query, page);
        if (hits.length < 1) {
          this.setState({ status: 'idle' });
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          this.setState({
            items: hits,
            query,
            totalHits: totalHits,
            status: 'resolved',
          });
        }
      } catch (error) {
        this.setState({ status: 'rejected' });
      }
    }
  };

  onNextPageLoad = async () => {
    this.setState({ status: 'pending' });

    try {
      const { hits } = await fetchImages(this.state.query, (page += 1));
      this.setState(prevState => ({
        items: [...prevState.items, ...hits],
        status: 'resolved',
      }));
    } catch (error) {
      this.setState({ status: 'rejected' });
    }
  };

  render() {
    const { totalHits, status, items } = this.state;
    if (status === 'idle') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.onSubmit} />
        </div>
      );
    }
    if (status === 'pending') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.onSubmit} />
          <ImageGallery page={page} items={items} />
          <Loader />
          {totalHits > 12 && <Button onClick={this.onNextPage} />}
        </div>
      );
    }
    if (status === 'rejected') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.onSubmit} />
          <p>Something went wrong, please try again later.</p>
        </div>
      );
    }
    if (status === 'resolved') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.onSubmit} />
          <ImageGallery page={page} items={items} />
          {totalHits > 12 && totalHits > items.length && (
            <Button onClick={this.onNextPageLoad} />
          )}
        </div>
      );
    }
  }
}
