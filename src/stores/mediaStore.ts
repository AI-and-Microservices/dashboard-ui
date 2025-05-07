import { create } from "zustand"

type MediaStore = {
  isOpen: boolean
  callback: ((image: string) => void) | null
  open: (cb: (image: string) => void) => void
  close: () => void
  trigger: (img: string) => void
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  isOpen: false,
  callback: null,
  open: (cb) => set({ isOpen: true, callback: cb }),
  close: () => set({ isOpen: false, callback: null }),
  trigger: (img) => {
    const cb = get().callback
    if (cb) cb(img)
    set({ isOpen: false, callback: null })
  },
}))
