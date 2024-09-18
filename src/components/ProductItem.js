import React, { useState, useEffect } from 'react';
import dots from '../assets/dots.png';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem'; 

const ProductItem = ({
  product,
  onUpdateProducts, 
  onRemove,
  isRemovable,
  onSelectProductClick,
}) => {
  const [showVariants, setShowVariants] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [variantDiscounts, setVariantDiscounts] = useState(
    Array.isArray(product.variants)
      ? product.variants.map(() => ({ discountType: 'percentage', discountValue: '' }))
      : []
  );


  const [variantOrder, setVariantOrder] = useState(
    Array.isArray(product.variants) ? product.variants.map((variant) => variant.id) : []
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;


    if (!over || active.id === over.id) {
        return; 
    }

    const oldIndex = variantOrder.indexOf(active.id);
    const newIndex = variantOrder.indexOf(over.id);

   
    if (oldIndex === -1 || newIndex === -1) {
        return; 
    }

    const newOrder = arrayMove(variantOrder, oldIndex, newIndex);
    setVariantOrder(newOrder);

    const newVariantDiscounts = arrayMove(variantDiscounts, oldIndex, newIndex);
    setVariantDiscounts(newVariantDiscounts);

    const newVariants = Array.isArray(product.variants)
        ? newOrder.map((id) => product.variants.find((v) => v.id === id)).filter(Boolean)
        : [];

    if (onUpdateProducts && Array.isArray(newVariants)) {
        onUpdateProducts({ ...product, variants: newVariants });
    }
};


  const handleEditClick = () => {
    onSelectProductClick();
  };

  const handleToggleVariants = () => {
    setShowVariants(!showVariants);
  };

  const handleDiscountChange = (e) => {
    let value = e.target.value;

    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)) {
      setDiscountValue(value);
    }
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
  };

  const handleVariantDiscountChange = (index, field, value) => {
    
    setVariantDiscounts((prevDiscounts) => {
      const updatedDiscounts = [...prevDiscounts];
  
   
      if (!updatedDiscounts[index]) {
        updatedDiscounts[index] = { discountType: 'percentage', discountValue: '' };
      }
  
    
      updatedDiscounts[index][field] = value;
  
      console.log('Updated Discounts:', updatedDiscounts); 
      return updatedDiscounts;
    });
  };
  

  useEffect(() => {
    if (Array.isArray(product.variants)) {
      if (variantOrder.length !== product.variants.length) {
        setVariantDiscounts(
          product.variants.map(() => ({ discountType: 'percentage', discountValue: '' }))
        );
      }
    }
  }, [product.variants, variantOrder.length]);

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
            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>
            {Array.isArray(product.variants) && product.variants.length > 1 && (
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
          <div className="discount-controls">
            <img src={dots} alt="dots" className="dots-image" />
            <div className="discount-inputs">
              <select value={discountType} onChange={handleDiscountTypeChange}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
              <input
                type="number"
                placeholder="Discount value"
                value={discountValue}
                onChange={handleDiscountChange}
                max="100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Display Variants */}
      {showVariants && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={variantOrder} strategy={verticalListSortingStrategy}>
            <div className="variant-list">
              {variantOrder.map((variantId, index) => {
                const variant = Array.isArray(product.variants) ? product.variants.find((v) => v.id === variantId) : null;
                if (!variant) return null; 

                return (
                  <SortableItem key={variant.id} id={variant.id}>
                    <div className="variant-item">
                      <span>{variant.title}</span>
                      {/* Discount for Variant */}
                      <div className="discount-section">
                        <div className="discount-controls">
                          <img src={dots} alt="dots" className="dots-image" />
                          <div className="discount-inputs">
                            <select
                              value={variantDiscounts[index]?.discountType || 'percentage'}
                              onChange={(e) =>
                                handleVariantDiscountChange(index, 'discountType', e.target.value)
                              }
                            >
                              <option value="percentage">Percentage</option>
                              <option value="flat">Flat</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Discount value"
                              value={variantDiscounts[index]?.discountValue || ''}
                              onChange={(e) =>
                                handleVariantDiscountChange(index, 'discountValue', e.target.value)
                              }
                            min="0"
                            max="100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ProductItem;
