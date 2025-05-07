import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ModalState {
  isMediaLibraryOpen: boolean;
  toggleMediaModal: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalState>()(
  persist(
    (set) => ({
      isMediaLibraryOpen: false,
      toggleMediaModal: (isOpen: boolean) => {
        set({isMediaLibraryOpen: isOpen})
      },
      
    }),
    {
      name: 'modal-storage', // name of the item in the storage (must be unique)
    },
  ),

)

