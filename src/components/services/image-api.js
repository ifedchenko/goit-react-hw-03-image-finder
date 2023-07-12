import axios from 'axios';

const APIKEY = '36679994-fdec862cf8a926d17bd3d37a5';

export async function fetchImages(query, page) {
  const searchParams = new URLSearchParams({
    key: APIKEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 12,
    page,
  });
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);

  return response.data;
}
