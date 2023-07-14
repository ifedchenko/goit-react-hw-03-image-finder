import React, { Component } from 'react';
import Notiflix from 'notiflix';
import Searchbar from './Searchbar/Searchbar';
import { fetchImages } from './services/image-api';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';

export class App extends Component {
  state = {
    query: '',
    page: 1,
    items: [],
    status: 'idle',
    totalHits: 0,
  };

  async componentDidUpdate(_, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      const response = await fetchImages(this.state.query, this.state.page);
      if (response.hits.length === 0) {
        Notiflix.Notify.warning('Please fill search text');
      } else {
        this.setState(prevState => ({
          items: [...prevState.items, ...response.hits],
          status: 'resolved',
          totalHits: response.totalHits,
        }));
      }
    }
  }

  onSubmit = query => {
    if (this.state.query === query) {
      return Notiflix.Notify.warning(`You are already watching "${query}"`);
    }
    this.setState({
      query: query.toLowerCase(),
      items: [],
      page: 1,
    });
  };

  onNextPageLoad = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
      status: 'pending',
    }));
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
          <ImageGallery page={this.state.page} items={items} />
          <Loader />
          {totalHits > 12 && <Button onClick={this.onNextPageLoad} />}
        </div>
      );
    }

    if (status === 'resolved') {
      return (
        <div className="App">
          <Searchbar onSubmit={this.onSubmit} />
          <ImageGallery page={this.state.page} items={items} />
          {totalHits > 12 && totalHits > items.length && (
            <Button onClick={this.onNextPageLoad} />
          )}
        </div>
      );
    }
  }
}
