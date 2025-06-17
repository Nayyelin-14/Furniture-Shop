import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  carts: CartItem[];
}

interface CartActions {
  getTotalItems: () => number;
  getTotalPrice: () => number;
  addItem: (item: CartItem) => void;
  updateItem: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const initialCartState: CartState = {
  carts: [],
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    immer((set, get) => ({
      ...initialCartState,
      getTotalItems: () => {
        const { carts } = get(); // returns the current state of the store.
        return carts.reduce(
          (totalQuan, product) => totalQuan + product.quantity,
          0
        );
      },
      getTotalPrice: () => {
        const { carts } = get(); // take the value from carts
        return carts.reduce(
          (totalPrice, product) =>
            totalPrice + product.quantity * product.price,
          0
        );
      },
      addItem: (item: CartItem) =>
        set((state) => {
          const existedItem = state.carts.find((i) => i.id === item.id);
          if (existedItem) {
            existedItem.quantity = item.quantity || 1;
          } else {
            state.carts.push({ ...item, quantity: item.quantity || 1 });
          }
        }),

      updateItem: (id: number, quantity: number) =>
        set((state) => {
          const existedItem = state.carts.find((item) => item.id === id);
          if (existedItem) {
            existedItem.quantity = quantity;
          }
        }),
      removeItem: (id) =>
        set((state) => ({
          carts: state.carts.filter((item) => item.id !== id),
        })),
      clearCart: () => set(initialCartState),
    })),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
