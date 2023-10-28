import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});
const shoppingCartReducer = (state, action) => {
  if (action.type === "ADD-ITEM") {
    const updatedItems = [...state.items];
    const existingCartIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartIndex];
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }
    return { items: updatedItems };
  }
  if (action.type === "UPDATE-ITEM") {
    const updatedItems = { ...state.items };
    const existingCartIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id ===  action.productId
    );
    const updatedItem = { ...updatedItems[existingCartIndex] };
    updatedItem.quantity +=  action.payload.amount;
    if (updatedItem.quantity <= 0) {
      updatedItems.splice(existingCartIndex, 1);
    } else {
      updatedItems[existingCartIndex] = updatedItem;
    }
    return {
        ...state,
      items: updatedItems,
    };
  }

  return state;
};
export const CartContextProvider = ({ children }) => {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  function handleAddItemToCart(id) {
    shoppingCartDispatch({
      action: "ADD-ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      action: "UPDATE-ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }
  const ctxValue = {
    items: shoppingCartState,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };
  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};
