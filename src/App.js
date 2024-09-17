// src/App.js
import React, { useState } from 'react';
import ProductList from './components/ProductList';
import './App.css';

const App = () => {
    const [products, setProducts] = useState([]);

    return (
        <div className="App">
            <h1>Product Picker</h1>
            <ProductList products={products} setProducts={setProducts} />
        </div>
    );
};

export default App;
