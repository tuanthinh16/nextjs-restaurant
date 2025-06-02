import { Dish } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const initialState: Dish[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<Dish[]>) {
            return action.payload;
        },
        addToCart(state, action: PayloadAction<{ dish: Dish; quantity?: number }>) {
            const { dish, quantity = 1 } = action.payload;
            const existing = state.find(item => item.id === dish.id);
            if (existing) {
                existing.quantity = (existing.quantity ?? 0) + quantity;
            } else {
                state.push({ ...dish, quantity });
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state));
            }
        }
        ,
        removeFromCart(state, action: PayloadAction<number>) {
            const updated = state.filter(item => item.id !== action.payload);
            // console.log('Updated cart after removal:', updated);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(updated));
            }
            return updated;
        },
        clearCart() {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
            return [];
        },
        updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
            const { id, quantity } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state));
                }
            }
        }

    },
});

export const { addToCart, removeFromCart, clearCart, setCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
