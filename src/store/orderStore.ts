import { create } from 'zustand';
import { Order } from '../types';
import { mockOrders } from '../data/mockData';

interface OrderState {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string; orderId?: string }>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<{ success: boolean; message: string }>;
  getOrdersByUser: (userId: string, role: 'buyer' | 'seller') => Order[];
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,

  createOrder: async (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: (get().orders.length + 1).toString(),
      createdAt: new Date(),
    };

    set(state => ({
      orders: [...state.orders, newOrder]
    }));

    return { success: true, message: 'Order placed successfully', orderId: newOrder.id };
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    set(state => ({
      orders: state.orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status,
          completedAt: status === 'completed' ? new Date() : order.completedAt
        } : order
      )
    }));

    return { success: true, message: 'Order status updated successfully' };
  },

  getOrdersByUser: (userId: string, role: 'buyer' | 'seller') => {
    const { orders } = get();
    return orders.filter(order => 
      role === 'buyer' ? order.buyerId === userId : order.sellerId === userId
    );
  },

  getOrderById: (id: string) => {
    return get().orders.find(order => order.id === id);
  },
}));