"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem } from "@/data/menuData";

export interface CartItemCustomization {
  brothRichness?: string;
  noodleFirmness?: string;
  spiceLevel?: number;
  toppings?: string[];
  specialInstructions?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: CartItemCustomization;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number, customization?: CartItemCustomization, toppingsPrice?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("yume-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("yume-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    customization?: CartItemCustomization,
    toppingsPrice: number = 0
  ) => {
    const itemId = `${menuItem.id}-${Date.now()}`;
    const totalPrice = (menuItem.price + toppingsPrice) * quantity;

    const newItem: CartItem = {
      id: itemId,
      menuItem,
      quantity,
      customization,
      totalPrice,
    };

    setItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const basePrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity,
            totalPrice: basePrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}