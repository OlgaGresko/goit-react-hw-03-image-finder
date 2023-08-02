const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38567102-8d912c5c14c2729736b8a9f4b';

export default async function fetchGallery(filter, page) {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${filter}&image_type=photo&orientation=horizontal&per_page=12&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.log(error.message);
  }
}
