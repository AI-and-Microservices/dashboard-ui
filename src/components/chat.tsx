import { Fragment, useRef, useState } from 'react'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSend,
  IconVideo,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useMutationWithAuth, useQueryWithAuth } from '@/lib/useQueryWithAuth'
import { Conversation } from '@/stores/conversationStore'
import { format } from 'date-fns'
import { useChatRoom } from '@/hooks/useSocket';
import { uploadFile } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { Message, Attachment } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'

interface ChatProps {
    conversation: Conversation;
    conversationKey: string;
    promptKey: string;
    avatar: string;
    name: string;
    description: string;
}

export default function Chat({conversation, conversationKey, promptKey, avatar, name, description}: ChatProps) {
    const queryClient = useQueryClient();
    const [mobileSelectedUser, setMobileSelectedUser] = useState(null)
    const {user} = useAuthStore()
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {mutate: sendMessage}: any = useMutationWithAuth('post', `/conversation/conversations/${conversation?._id}/messages`, {
        onSuccess: () => {
            // console.log('send message success')
        }
    })
    const { data, isLoading, error }: { data: any, isLoading: boolean, error: any } = useQueryWithAuth(['messages', conversation?._id], `/conversation/conversations/${conversation?._id}/messages`)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages: Message[] = data?.data

    const handleNewMessage = async (msg: Message) => {
        queryClient.setQueryData(['messages', conversation?._id], (oldData: any) => {
            const {data} = oldData
            const newMessages = [...data, msg]
            oldData.data = newMessages
            return oldData
        });
        // delay scroll to bottom
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }

    useChatRoom(conversation?._id, handleNewMessage)
   

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const imageFiles = Array.from(e.target.files).filter(file => file);
          //file.type.startsWith('image/')
          
          if (imageFiles.length > 0) {
              setAttachments(imageFiles);
          }
          
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
        }
      };
  
      const openFileDialog = () => {
        if (fileInputRef.current) {
        fileInputRef.current.click();
        }
      };
  
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
      };

    const uploadAttachments = async (attachmentFiles: File[] = []) => {
        setIsUploading(true);
        setUploadingFiles([...attachmentFiles]);
        
        let attachments: Attachment[] = [];
        
        if (attachmentFiles.length > 0) {
            const uploadPromises = attachmentFiles.map(file => uploadFile(file));
            const results = await Promise.all(uploadPromises);
            
            attachments = results.filter(result => result !== null) as Attachment[];
            attachments.forEach(attachment => {
                attachment.mimeType = attachment.type;
                attachment.type = attachment.type.split('/')[0];
            });
        }
        console.log(attachments)
        setIsUploading(false);
        setUploadingFiles([]);
  
        return attachments
    }
    const handleSendMessage = async () => {
        if (!conversation?._id) return;
        if (!user?._id) return;
        if (inputValue.trim() === '') return;
        
        if (isUploading) return;
              
        let attData: Attachment[] = []
        if (attachments.length > 0) {
            const currentAttachments = [...attachments];

            let attachmentFiles: Attachment[] = await uploadAttachments(currentAttachments)
            attData = attachmentFiles
        }
        
        const userMessage: Message = {
            _id: Date.now().toString(),
            senderId: user._id,
            content: inputValue,
            attachments: attData,
            conversationId: conversation._id ,
            senderType: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await sendMessage(userMessage)
        setInputValue('');
        setAttachments([])
        setUploadingFiles([])
        
    };
    return (
        <div
            className={cn(
                'bg-primary-foreground absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex',
                mobileSelectedUser && 'left-0 flex'
              )}
            >
            {/* Top Part */}
            <div className='bg-secondary mb-1 flex flex-none justify-between rounded-t-md p-4 shadow-lg'>
            {/* Left */}
            <div className='flex gap-3'>
                <Button
                size='icon'
                variant='ghost'
                className='-ml-2 h-full sm:hidden'
                onClick={() => setMobileSelectedUser(null)}
                >
                <IconArrowLeft />
                </Button>
                <div className='flex items-center gap-2 lg:gap-4'>
                <Avatar className='size-9 lg:size-11'>
                    <AvatarImage
                    src={avatar}
                    alt="Assistant"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                    <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                    {name}
                    </span>
                    <span className='text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm'>
                    {description}
                    </span>
                </div>
                </div>
            </div>

            {/* Right */}
            <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                <Button
                size='icon'
                variant='ghost'
                className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                <IconVideo size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                size='icon'
                variant='ghost'
                className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                <IconPhone size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                size='icon'
                variant='ghost'
                className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                >
                <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                </Button>
            </div>
            </div>

            {/* Conversation */}
            <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4'>
            <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                <div className='chat-flex flex h-40 w-full grow flex-col justify-start gap-4 overflow-y-auto py-2 pr-4 pb-4'>
                  
                    {messages &&
                    messages.map((msg: Message) => (
                        <div key={msg._id} className={`flex items-start gap-2 ${msg.senderId === user?._id ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Avatar className='size-9 lg:size-11'>
                                <AvatarImage
                                src={msg.senderId === user?._id ? user.avatar : avatar}
                                alt={msg.senderId === user?._id ? user.name : name}
                                />
                                <AvatarFallback>{msg.senderId === user?._id ? user.name : name}</AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    'chat-box max-w-72 px-3 py-2 break-words shadow-lg',
                                    msg.senderId === user?._id
                                    ? 'bg-primary/85 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]'
                                    : 'bg-secondary self-start rounded-[16px_16px_16px_0]'
                                )}
                                >
                                
                                {msg.attachments.length > 0 && (
                                    <div className='flex flex-wrap gap-2'>
                                        {msg.attachments.map((attachment: Attachment) => {
                                            if (attachment.type === 'image') {
                                                return <img src={attachment.url} alt={attachment.name} className='w-40 h-40 object-cover rounded' />
                                            }
                                            return <div className='rounded-lg px-2 py-2 break-words bg-gray-700 text-gray-300'>{attachment.name}</div>
                                        })}
                                    </div>
                                )}
                                {msg.content}{' '}
                                <span
                                    className={cn(
                                    'text-muted-foreground mt-1 block text-xs font-light italic',
                                    msg.senderId === user?._id && 'text-right'
                                    )}
                                >
                                    {format(msg.createdAt, 'h:mm a')}
                                </span>
                                </div>
                            {/* TODO: Add message date */}
                            {/* <div className='text-center text-xs'>{msg.content}</div> */}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full flex-none gap-2'>
                {
                    attachments.length > 0 && <div className="mt-4 pt-4 border-t border-gray-700/20 flex flex-col">
                    <div className="flex mb-2">
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="relative">
                                    {
                                    file.type.indexOf('image') >= 0 ? <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-16 h-16 object-cover rounded"
                                    /> : <div className='rounded-lg px-2 py-2 break-words bg-gray-700 text-gray-300'>{file.name}</div>
                                }
                                    
                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        aria-label="Remove attachment"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            </div>
                        )}
                        
                        {/* Hiển thị trạng thái upload */}
                        {isUploading && (
                            <div className="mb-2 text-sm text-gray-500 flex items-center">
                            <div className="mr-2 w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                            Uploading {uploadingFiles.length} file(s)...
                            </div>
                        )}
                    </div>
                </div>
                }
                
                <div className='border-input focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4'>
                    <div className='space-x-1'>
                        {/* <Button size='icon' type='button' variant='ghost' className='h-8 rounded-md'>
                            <IconPlus size={20} className='stroke-muted-foreground'/>
                        </Button> */}
                        <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*, .doc,.docx,.xml,application/msword,application/pdf,.xlsx"
                        // multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        />
                        <Button 
                            size='icon' 
                            type='button' 
                            variant='ghost' 
                            className='hidden h-8 rounded-md lg:inline-flex'
                            disabled={isUploading}
                            onClick={openFileDialog}
                        >
                            <IconPhotoPlus
                                size={20}
                                className='stroke-muted-foreground'
                            />
                        </Button>
                        <Button 
                            size='icon' 
                            type='button' 
                            variant='ghost' 
                            className='hidden h-8 rounded-md lg:inline-flex'
                            disabled={isUploading}
                            onClick={openFileDialog}
                        >
                            <IconPaperclip
                                size={20}
                                className='stroke-muted-foreground'
                            />
                        </Button>
                    </div>
                    <label className='flex-1'>
                        <span className='sr-only'>Chat Text Box</span>
                        <Input
                            type='text'
                            placeholder='Type your messages...'
                            className='h-10 w-full bg-inherit focus-visible:outline-hidden'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                    </label>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden sm:inline-flex'
                        disabled={inputValue.trim() === ''}
                        onClick={handleSendMessage}
                    >
                        <IconSend size={20} />
                    </Button>
                    </div>
                    <Button 
                        className='h-full sm:hidden'
                        disabled={inputValue.trim() === ''}
                        onClick={handleSendMessage}
                    >
                        <IconSend size={18} /> Send
                    </Button>
                </div>
            </div>
        </div>
    )
}
