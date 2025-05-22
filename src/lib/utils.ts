import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAxios } from './api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Attachment = {
    _id: string;
    url: string;
    type: string;
    name: string;
    size: number;
    thumbnailUrl: string;
}

export const uploadFile = async (file: File): Promise<Attachment | null> => {
    // const file = event.target.files?.[0];
    if (!file) return null;
  
    try {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('file', file);
      
      // Thay đổi URL API upload của bạn tại đây
      const {data} = await customAxios('multipart/form-data').post('file/files', formData);
      
      const result = data.data
      const obj: Attachment = {
        _id: result.id || Date.now().toString(),
          url: result.url,
          type: result.mimetype,
          name: result.name,
          size: result.size,
          thumbnailUrl: result.thumbnailUrl || result.url,
      }
      return obj
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
  };
  