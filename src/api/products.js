
import axios from 'axios';

const API_URL = 'https://stageapi.monkcommerce.app/task/products/search';
const API_KEY = '72njgfa948d9aS7gs5';

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
