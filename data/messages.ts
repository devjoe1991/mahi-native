import { ConversationData, MessageData } from '../screens/messagesScreen/types';

/**
 * Mock messages data - Ready for Supabase integration
 * 
 * When integrating with Supabase:
 * - Replace with query from messages table
 * - Fetch conversations: SELECT DISTINCT ON (conversation_id) ...
 * - Fetch messages: SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at
 */
export const getConversations = async (userId: string): Promise<ConversationData[]> => {
  // Mock data - replace with Supabase query
  return [
    {
      _id: '1',
      userId: 'user2',
      username: 'maximus',
      fullName: 'Maximus',
      avatarUrl: 'https://via.placeholder.com/150',
      lastMessage: 'Great workout today! 🔥',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      unreadCount: 2,
      isOnline: true,
    },
    {
      _id: '2',
      userId: 'user3',
      username: 'verity',
      fullName: 'Verity',
      avatarUrl: 'https://via.placeholder.com/150',
      lastMessage: 'Thanks for the motivation!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
    },
    {
      _id: '3',
      userId: 'user4',
      username: 'ellie',
      fullName: 'Ellie',
      avatarUrl: 'https://via.placeholder.com/150',
      lastMessage: 'Keep up the streak! 💪',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      unreadCount: 1,
      isOnline: true,
    },
  ];
};

export const getMessages = async (conversationId: string): Promise<MessageData[]> => {
  // Mock data - replace with Supabase query
  return [
    {
      _id: '1',
      conversationId,
      senderId: 'user2',
      receiverId: 'currentUser',
      content: 'Hey! How was your workout?',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      _id: '2',
      conversationId,
      senderId: 'currentUser',
      receiverId: 'user2',
      content: 'It was amazing! Thanks for asking 🔥',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    },
    {
      _id: '3',
      conversationId,
      senderId: 'user2',
      receiverId: 'currentUser',
      content: 'Great workout today! 🔥',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];
};

