import { create } from 'zustand';
import { Message, Conversation } from '../types';

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (content: string, receiverId: string, orderId?: string) => Promise<{ success: boolean; message: string }>;
  getConversations: (userId: string) => Conversation[];
  getMessages: (conversationId: string) => Message[];
  markAsRead: (messageId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  conversations: [],

  sendMessage: async (content: string, receiverId: string, orderId?: string) => {
    // This would typically integrate with a real-time messaging service
    const newMessage: Message = {
      id: (get().messages.length + 1).toString(),
      senderId: 'current-user-id', // Would be from auth store
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
      orderId,
    };

    set(state => ({
      messages: [...state.messages, newMessage]
    }));

    return { success: true, message: 'Message sent successfully' };
  },

  getConversations: (userId: string) => {
    // This would group messages by participants
    return get().conversations;
  },

  getMessages: (conversationId: string) => {
    // This would filter messages for a specific conversation
    return get().messages;
  },

  markAsRead: (messageId: string) => {
    set(state => ({
      messages: state.messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    }));
  },
}));