
import React from 'react';

const AddProductButton = ({ setProducts }) => {
    const handleAddProduct = () => {
        setProducts((prevProducts) => [
            ...prevProducts,
            { id: Date.now(), title: 'New Product', variants: [] },
        ]);
    };

    return <button onClick={handleAddProduct}>Add Product</button>;
};

export default AddProductButton;
