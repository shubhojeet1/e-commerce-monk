// src/components/ProductList.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProductItem from './ProductItem';
import AddProductButton from './AddProductButton';

const ProductList = ({ products, setProducts }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedProducts = Array.from(products);
        const [movedItem] = reorderedProducts.splice(result.source.index, 1);
        reorderedProducts.splice(result.destination.index, 0, movedItem);

        setProducts(reorderedProducts);
    };

    const handleUpdateProducts = (updatedProducts, index) => {
        const newProductsList = [...products];
        newProductsList.splice(index, 1, ...updatedProducts);
        setProducts(newProductsList);
    };

    const handleRemoveProduct = (index) => {
        const newProductsList = [...products];
        newProductsList.splice(index, 1);
        setProducts(newProductsList);
    };

    return (
        <div>
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
                                                onUpdateProducts={(updatedProducts) =>
                                                    handleUpdateProducts(updatedProducts, index)
                                                }
                                                onRemove={() => handleRemoveProduct(index)}
                                                isRemovable={products.length > 1} // Show "x" only if more than one product
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
            <AddProductButton setProducts={setProducts} />
        </div>
    );
};

export default ProductList;
