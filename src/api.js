import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY; 
const BASE_URL = process.env.BASE_URL;

export const fetchProducts = async (search = '', page = 0, limit = 10) => {
  try {
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
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return an empty array in case of an error to prevent breaking the app
  }
};
