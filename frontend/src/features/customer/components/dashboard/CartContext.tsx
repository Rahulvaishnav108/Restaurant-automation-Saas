import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  resCharges: number;
  discount: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 'hyderabadi-biryani',
      name: 'Hyderabadi Biryani',
      price: 249,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHYem6bkKsSZov-pTPsayutJFRKZuUM8qKFDCGwhacfJDN9LO1HuKjD48AQgc2MAA3H7xJbRfye2qAF4wTpjGxvSRvmBqg6cUwbsvjztrgk0CxsVrzwcofrJhsoahw4gbYp7ftTyjGqmiyXqiJm7bt4MgBPZIRcEBRxfSQ4GyY-Ev7S0zT82vZ43vW5PRncMmRup3lvMnKjaVnK2Ks5QxqV6trdVHz7IWkBDOyp0kaIwnUxW2EHqnxnvxaaigxPAXnEGtT97OKh4',
      description: 'Aromatic basmati rice with perfection and exotic spices',
    },
    {
      id: 'butter-chicken',
      name: 'Butter Chicken',
      price: 229,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg0gCUG1WXOEL41PSVwQYummflfHXXjJxTFKvTEXlAqYbGypD3aJXmIanbsOtEgWJioGz1cNkr_YruzDd9ibI9wzd73xWO8Dnu94QPXBBBf9sEPl8H3DKm2tvCkzEr7zg8XIiPeY1sgDW-jgHbWhEoRzAkJ1y4-0kBL8LwuYtewqHG3L87RVFG3iUrG30eT9Sx-zXRd7ga8EunXWev5dyShj2F5VEtbATELbhQaAXKHQmyIBkIHZFE2TVIi3uqhG-wzCRjd4P6mQk',
      description: 'Creamy tomato gravy with tender chicken chunks',
    },
    {
      id: 'garlic-naan',
      name: 'Garlic Naan',
      price: 49,
      quantity: 2,
      image: '',
      description: 'Leavened bread topped with melted butter and fresh garlic',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(true);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.length, [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const resCharges = 30;
  const discount = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);
  const total = useMemo(() => subtotal + resCharges - discount, [subtotal, resCharges, discount]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      resCharges,
      discount,
      total,
      isCartOpen,
      setIsCartOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, resCharges, discount, total, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
