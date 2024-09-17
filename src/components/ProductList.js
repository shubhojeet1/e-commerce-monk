// src/components/ProductList.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProductItem from './ProductItem';
import ProductPicker from './ProductPicker';

const ProductList = ({ products, setProducts }) => {
    const [isPickerOpen, setPickerOpen] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(null); 

    const handleAddPlaceholderProduct = () => {
        const newPlaceholderProduct = {
            id: Date.now(),
            title: 'Select Product',
            variants: [],
            isPlaceholder: true 
        };
        setProducts([...products, newPlaceholderProduct]);
    };

    const handleSelectProductClick = (index) => {
        setCurrentProductIndex(index);
        setPickerOpen(true);
    };

    const handleAddNewProduct = (selectedProducts) => {
        const newProductsList = [...products];
        newProductsList.splice(currentProductIndex, 1, ...selectedProducts);
        setProducts(newProductsList);
        setPickerOpen(false);
        setCurrentProductIndex(null);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedProducts = Array.from(products);
        const [movedItem] = reorderedProducts.splice(result.source.index, 1);
        reorderedProducts.splice(result.destination.index, 0, movedItem);

        setProducts(reorderedProducts);
    };

    const handleRemoveProduct = (index) => {
        const newProductsList = [...products];
        newProductsList.splice(index, 1);
        setProducts(newProductsList);
    };

    return (
        <div className="product-list">
            {/* Add Product Button */}
            <button className="add-product-button" onClick={handleAddPlaceholderProduct}>Add Product</button>

            {/* ProductPicker Modal for selecting a product */}
            {isPickerOpen && (
                <ProductPicker
                    setPickerOpen={setPickerOpen}
                    onSelectProducts={handleAddNewProduct}
                />
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="products">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {products.map((product, index) => (
                                <Draggable key={product.id} draggableId={product.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ProductItem
                                                product={product}
                                                index={index}
                                                onUpdateProducts={(updatedProducts) =>
                                                    handleAddNewProduct(updatedProducts)
                                                }
                                                onRemove={() => handleRemoveProduct(index)}
                                                isRemovable={products.length > 1}
                                                onSelectProductClick={() => handleSelectProductClick(index)}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ProductList;
