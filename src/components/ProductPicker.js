import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { fetchProducts } from "../api/products";

const ProductPicker = ({ setPickerOpen, onSelectProducts }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const modalBodyRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      if (loading) return;

      setLoading(true);
      try {
        const fetchedProducts = await fetchProducts(searchTerm, page);
        if (fetchedProducts.length < 10) {
          setHasMore(false);
        }
        setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchTerm, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;

      const modalBody = modalBodyRef.current;
      if (
        modalBody.scrollTop + modalBody.clientHeight >=
        modalBody.scrollHeight - 5
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const modalBody = modalBodyRef.current;
    if (modalBody) {
      modalBody.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalBody) {
        modalBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, loading]);

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
        <div
          className="modal-body"
          ref={modalBodyRef}
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setProducts([]);
              setPage(1);
              setHasMore(true);
            }}
          />
          <ul className="product-list-modal">
            {products.map((product) => (
              <li key={product.id} className="product-item-modal">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.find((p) => p.id === product.id)
                      ? true
                      : false
                  }
                  onChange={() => handleProductSelect(product)}
                />
                <span>{product.title}</span>
              </li>
            ))}
          </ul>
          {loading && <div className="loading">Loading...</div>}{" "}
        </div>
        <div className="modal-footer">
          <button className="confirm-button" onClick={handleConfirmSelection}>
            Confirm Selection
          </button>
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductPicker;