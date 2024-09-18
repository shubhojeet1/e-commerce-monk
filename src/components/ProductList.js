
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
            isPlaceholder: true,
        };

        setProducts((prevProducts) => Array.isArray(prevProducts) ? [...prevProducts, newPlaceholderProduct] : [newPlaceholderProduct]);
    };

    const handleSelectProductClick = (index) => {
        setCurrentProductIndex(index);
        setPickerOpen(true);
    };

    const handleAddNewProduct = (selectedProducts) => {
        const productsToAdd = Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts];

        setProducts((prevProducts) => {
            const newProductsList = Array.isArray(prevProducts) ? [...prevProducts] : [];
            newProductsList.splice(currentProductIndex, 1, ...productsToAdd);
            return newProductsList;
        });

        setPickerOpen(false);
        setCurrentProductIndex(null);
    };

 
    const handleUpdateProduct = (updatedProduct) => {
        setProducts((prevProducts) => {
            if (!Array.isArray(prevProducts)) return prevProducts;
            return prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            );
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        setProducts((prevProducts) => {
            const reorderedProducts = Array.isArray(prevProducts) ? Array.from(prevProducts) : [];
            const [movedItem] = reorderedProducts.splice(result.source.index, 1);
            reorderedProducts.splice(result.destination.index, 0, movedItem);
            return reorderedProducts;
        });
    };

    const handleRemoveProduct = (index) => {
        setProducts((prevProducts) => {
            const newProductsList = Array.isArray(prevProducts) ? [...prevProducts] : [];
            newProductsList.splice(index, 1);
            return newProductsList;
        });
    };

    return (
        <div className="product-list">
            <button className="add-product-button" onClick={handleAddPlaceholderProduct}>Add Product</button>

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
                            {Array.isArray(products) && products.map((product, index) => (
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
                                                onUpdateProducts={handleUpdateProduct} 
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
