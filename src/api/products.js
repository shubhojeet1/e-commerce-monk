
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;


export const fetchProducts = async (search = '', page = 0, limit = 10) => {
    try {
        const response = await axios.get(API_URL, {
            params: { search, page, limit },
            headers: {
                'x-api-key': API_KEY,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
