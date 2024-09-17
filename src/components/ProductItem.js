// src/components/ProductItem.js
import React, { useState } from 'react';
import ProductPicker from './ProductPicker';

const ProductItem = ({ product, onUpdateProducts, onRemove, isRemovable }) => {
    const [isPickerOpen, setPickerOpen] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');

    const handleEditClick = () => {
        setPickerOpen(true);
    };

    const handleSelectProducts = (selectedProducts) => {
        onUpdateProducts(selectedProducts);
    };

    const handleToggleVariants = () => {
        setShowVariants(!showVariants);
    };

    const handleDiscountChange = (e) => {
        setDiscountValue(e.target.value);
    };

    const handleDiscountTypeChange = (e) => {
        setDiscountType(e.target.value);
    };

    return (
        <div className="product-item">
            <div>
                <span>{product.title}</span>
                <button onClick={handleEditClick}>Edit</button>
                {product.variants.length > 1 && (
                    <button onClick={handleToggleVariants}>
                        {showVariants ? 'Hide Variants' : 'Show Variants'}
                    </button>
                )}
                {isRemovable && <button onClick={onRemove}>x</button>}
            </div>
            
            {/* Discount Section */}
            <div className="discount-section">
                <select value={discountType} onChange={handleDiscountTypeChange}>
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                </select>
                <input
                    type="number"
                    placeholder="Discount value"
                    value={discountValue}
                    onChange={handleDiscountChange}
                />
            </div>

            {/* Display Variants */}
            {showVariants && (
                <div className="variant-list">
                    {product.variants.map((variant, index) => (
                        <div key={variant.id} className="variant-item">
                            <span>{variant.title}</span>
                            {/* Discount for Variant */}
                            <div className="discount-section">
                                <select value={discountType} onChange={handleDiscountTypeChange}>
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Discount value"
                                    value={discountValue}
                                    onChange={handleDiscountChange}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isPickerOpen && (
                <ProductPicker
                    setPickerOpen={setPickerOpen}
                    onSelectProducts={handleSelectProducts}
                />
            )}
        </div>
    );
};

export default ProductItem;
