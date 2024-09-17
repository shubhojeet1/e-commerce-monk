import axios from 'axios';

const API_KEY = '72njgfa948d9aS7gs5'; // Replace with the API key shared via email
const BASE_URL = 'https://stageapi.monkcommerce.app/task/products/search';

export const fetchProducts = async (search = '', page = 0, limit = 10) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      'x-api-key': API_KEY,
    },
    params: {
      search,
      page,
      limit,
    },
  });
  return response.data;
};
