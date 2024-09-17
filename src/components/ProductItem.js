import React, { useState } from 'react';
import ProductPicker from './ProductPicker';

const ProductItem = ({ product, onUpdateProducts, onRemove, isRemovable, onSelectProductClick }) => {
    const [showVariants, setShowVariants] = useState(false);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [variantDiscounts, setVariantDiscounts] = useState(
        product.variants.map(() => ({ discountType: 'percentage', discountValue: '' }))
    );

    const handleEditClick = () => {
        onSelectProductClick();
    };

    const handleToggleVariants = () => {
        setShowVariants(!showVariants);
    };

    const handleDiscountChange = (e) => {
        let value = e.target.value;
        // Allow only numbers and decimals in the input and limit the value to 100
        if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)) {
            setDiscountValue(value);
        }
    };

    const handleDiscountTypeChange = (e) => {
        setDiscountType(e.target.value);
    };

    const handleVariantDiscountChange = (index, field, value) => {
        if (field === 'discountValue' && (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100))) {
            const updatedVariantDiscounts = [...variantDiscounts];
            updatedVariantDiscounts[index][field] = value;
            setVariantDiscounts(updatedVariantDiscounts);
        }
    };

    return (
        <div className="product-item">
            {product.isPlaceholder ? (
                <div>
                    <button onClick={onSelectProductClick}>Select Product</button>
                </div>
            ) : (
                <div className="product-item-header">
                    <span>{product.title}</span>
                    <div className="product-actions">
                        <button className="edit-button" onClick={handleEditClick}>Edit</button>
                        {product.variants.length > 1 && (
                            <button className="toggle-variants-button" onClick={handleToggleVariants}>
                                {showVariants ? 'Hide Variants' : 'Show Variants'}
                            </button>
                        )}
                        {isRemovable && <button className="delete-button" onClick={onRemove}>x</button>}
                    </div>
                </div>
            )}

            {/* Discount Section */}
            {!product.isPlaceholder && (
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
                        max="100" // Ensure the maximum value is 100
                    />
                </div>
            )}

            {/* Display Variants */}
            {showVariants && (
                <div className="variant-list">
                    {product.variants.map((variant, index) => (
                        <div key={variant.id} className="variant-item">
                            <span>{variant.title}</span>
                            {/* Discount for Variant */}
                            <div className="discount-section">
                                <select
                                    value={variantDiscounts[index].discountType}
                                    onChange={(e) => handleVariantDiscountChange(index, 'discountType', e.target.value)}
                                >
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Discount value"
                                    value={variantDiscounts[index].discountValue}
                                    onChange={(e) => handleVariantDiscountChange(index, 'discountValue', e.target.value)}
                                    max="100" // Ensure the maximum value is 100
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductItem;
