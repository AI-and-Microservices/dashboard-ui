import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Conversation {
    _id: string,
    mode: string,
    userId: string,
    applicationId?: string,
    promptKey?: string,
    isActive: boolean
}

export interface ConversationState {
  conversation: Conversation | null;
  appCreator: Conversation | null;
  virtualRoleCreator: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  setAppCreator: (appCreator: Conversation) => void;
  setVirtualRoleCreator: (virtualRoleCreator: Conversation) => void;
  clearConversation: () => void;
  getConversationByKey: (key: string) => Conversation | null;
  setConversationByKey: (key: string, conversation: Conversation) => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversation: null,
      appCreator: null,
      virtualRoleCreator: null,
      setConversation: (conversation: Conversation) => set({ conversation }),
      setAppCreator: (appCreator: Conversation) => set({ appCreator }),
      setVirtualRoleCreator: (virtualRoleCreator: Conversation) => set({ virtualRoleCreator }),
      clearConversation: () => set({ conversation: null }),
      getConversationByKey: (key: string) => {
        const { conversation, appCreator, virtualRoleCreator } = get();
        if (key === 'conversation') return conversation;
        if (key === 'appCreator') return appCreator;
        if (key === 'virtualRoleCreator') return virtualRoleCreator;
        return null;
      },
      setConversationByKey: (key: string, conversation: Conversation) => set({ [key]: conversation }),
    }),
    {
      name: 'conversation-storage', // name of the item in the storage (must be unique)
    },
  ),
)
