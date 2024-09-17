import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { fetchProducts } from '../api/products';

const ProductPicker = ({ setPickerOpen, onSelectProducts }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // New loading state
    const modalBodyRef = useRef(null);

    useEffect(() => {
        const loadProducts = async () => {
            if (loading) return; // Prevent multiple API calls

            setLoading(true);
            try {
                const fetchedProducts = await fetchProducts(searchTerm, page);
                if (fetchedProducts.length < 10) {
                    setHasMore(false); // No more products to load
                }
                setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false); // Reset loading state
            }
        };

        loadProducts();
    }, [searchTerm, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (!hasMore || loading) return; // If there are no more products or loading is true, do nothing

            const modalBody = modalBodyRef.current;
            if (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight - 5) {
                // Close to the bottom; load more products
                setPage((prevPage) => prevPage + 1);
            }
        };

        // Only add the event listener if modalBodyRef.current is not null
        const modalBody = modalBodyRef.current;
        if (modalBody) {
            modalBody.addEventListener('scroll', handleScroll);
        }

        // Cleanup function to remove the event listener
        return () => {
            if (modalBody) {
                modalBody.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loading]); // Include `hasMore` and `loading` in the dependency array

    const handleProductSelect = (product) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.find((p) => p.id === product.id)) {
                return prevSelected.filter((p) => p.id !== product.id);
            } else {
                return [...prevSelected, product];
            }
        });
    };

    const handleClose = () => {
        setPickerOpen(false);
    };

    const handleConfirmSelection = () => {
        onSelectProducts(selectedProducts);
        setPickerOpen(false);
    };

    return (
        <div className="overlay">
            <Modal
                isOpen={true}
                onRequestClose={handleClose}
                className="modal"
                overlayClassName="overlay"
            >
                <div className="modal-header">
                    <h2>Select Products</h2>
                </div>
                <div className="modal-body" ref={modalBodyRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setProducts([]); // Clear the previous products
                            setPage(1); // Reset the page number
                            setHasMore(true); // Reset pagination
                        }}
                    />
                    <ul className="product-list-modal">
                        {products.map((product) => (
                            <li key={product.id} className="product-item-modal">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.find((p) => p.id === product.id) ? true : false}
                                    onChange={() => handleProductSelect(product)}
                                />
                                <span>{product.title}</span>
                            </li>
                        ))}
                    </ul>
                    {loading && <div className="loading">Loading...</div>} {/* Show loading indicator */}
                </div>
                <div className="modal-footer">
                    <button className="confirm-button" onClick={handleConfirmSelection}>Confirm Selection</button>
                    <button className="close-button" onClick={handleClose}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default ProductPicker;
