import React from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';
import css from './ImageGallery.module.css';

const ImageGallery = ({ items }) => {
  return (
    <>
      <ul className={css.smageGallery}>
        {items.map(item => (
          <ImageGalleryItem key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
};

ImageGallery.propTypes = {
  items: PropTypes.array,
};

export default ImageGallery;
