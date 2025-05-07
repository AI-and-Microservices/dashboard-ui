import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  roles?: [string];
  avatar?: string
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  logout: () => void;
  googleVerify: (credential: string) => Promise<boolean>;
  clearError: () => void;
  setToken: (token: string) => void;
  getNewToken: (onError: Function) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // Register action
      googleVerify: async (credential: string) => {
        set({ isLoading: true, error: null });
        try {
          if (!credential) {
            throw new Error('Có lỗi xảy ra');
          }
          const {data} = await api.post('/user/oauth/google', {credential});
          if (!data?.success) {
            throw new Error(data?.message);
          }
          else {
            
            const user: User = { 
              _id: data.data.user._id, 
              email: data.data.user.email, 
              roles: data.data.user.roles,
              name: data.data.user.name,
              avatar: data.data.user?.avatar
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false, 
              token: data.data.accessToken, 
              refreshToken: data.data.refreshToken,
            });
            
            return true;
          }
          
          // set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return false;
        }
      },
      
      // Logout action
      logout: () => {
        set({ user: null, isAuthenticated: false, token: null, refreshToken: null });
        window.location.reload()
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // replace token
      setToken: (token: string) => {
        set({token: token });
      },
      getNewToken: async (onError) => {
        try {
          const {refreshToken} = get()
          const {data} = await api.post('/user/refresh-token', {refreshToken});
          
          set({ 
            isAuthenticated: true, 
            isLoading: false, 
            token: data.data.accessToken, 
            refreshToken: data.data.refreshToken,
          });
        }
        catch(error) {
          if (typeof onError === 'function') {
            onError(error)
          }
        }
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    },
  ),

)
