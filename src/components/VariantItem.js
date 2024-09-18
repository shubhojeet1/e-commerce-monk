import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = {
    VARIANT: 'VARIANT',
};

const VariantItem = ({ variant, index, moveVariant, variantDiscount, handleVariantDiscountChange }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE.VARIANT,
        item: { type: ITEM_TYPE.VARIANT, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ITEM_TYPE.VARIANT,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveVariant(draggedItem.index, index);
                draggedItem.index = index; 
            }
        },
    });

    return (
        <div ref={(node) => drag(drop(node))} className="variant-item" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <span>{variant.title}</span>
            {/* Discount for Variant */}
            <div className="discount-section">
                <select
                    value={variantDiscount.discountType}
                    onChange={(e) => handleVariantDiscountChange(index, 'discountType', e.target.value)}
                >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                </select>
                <input
                    type="number"
                    placeholder="Discount value"
                    value={variantDiscount.discountValue}
                    onChange={(e) => handleVariantDiscountChange(index, 'discountValue', e.target.value)}
                    max="100"
                />
            </div>
        </div>
    );
};

export default VariantItem