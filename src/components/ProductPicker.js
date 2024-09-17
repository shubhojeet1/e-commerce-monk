// src/components/ProductPicker.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchProducts } from '../api/products';

const ProductPicker = ({ setPickerOpen, onSelectProducts }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const fetchedProducts = await fetchProducts(searchTerm);
            setProducts(fetchedProducts);
        };
        loadProducts();
    }, [searchTerm]);

    const handleProductSelect = (product) => {
        // Toggle selection of the product
        setSelectedProducts((prevSelected) => {
            if (prevSelected.find((p) => p.id === product.id)) {
                return prevSelected.filter((p) => p.id !== product.id);
            } else {
                return [...prevSelected, product];
            }
        });
    };

    const handleConfirmSelection = () => {
        onSelectProducts(selectedProducts);
        setPickerOpen(false);
    };

    return (
        <Modal isOpen={true} onRequestClose={() => setPickerOpen(false)}>
            <h2>Select Products</h2>
            <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id}>
                        <input
                            type="checkbox"
                            checked={selectedProducts.find((p) => p.id === product.id) ? true : false}
                            onChange={() => handleProductSelect(product)}
                        />
                        <span>{product.title}</span>
                    </div>
                ))}
            </div>
            <button onClick={handleConfirmSelection}>Confirm Selection</button>
            <button onClick={() => setPickerOpen(false)}>Close</button>
        </Modal>
    );
};

export default ProductPicker;
