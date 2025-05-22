import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutationWithAuth } from '@/lib/useQueryWithAuth';
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Breadcrumbs } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
 } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { IconInfoCircle } from '@tabler/icons-react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModalStore } from "@/stores/modalStore";
import Chat from '@/components/chat';
import { useConversationStore } from '@/stores/conversationStore';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
const appSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  type: z.string(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  virtualRoles: z.array(z.string()),
  cover: z.string(),
  logo: z.string(),
  prompt: z.string(),
});

type AppFormValues = z.infer<typeof appSchema>;


const HoverInfo = (props: {text: string}) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <IconInfoCircle size={20}/>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <p>{props.text}</p>
                </div>
            </HoverCardContent>
        </HoverCard>

    )
}

const avatar = '/images/assistant-avatar.png'
const conversationKey = 'appCreator'
const promptKey = 'APP_CREATOR'

const CreateApp = () => {
    const {user} = useAuthStore()
    const {setConversationByKey, getConversationByKey} = useConversationStore()
    const conversation = getConversationByKey(conversationKey)    
    const {mutate: createConversation}: any = useMutationWithAuth('post', 'conversation/conversations', {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (data: any) => {
            // eslint-disable-next-line no-console
            console.log('conversation created', data)
            setConversationByKey(conversationKey, data?.data)
        }
    })

    useEffect(() => {
        if (!conversation) {
            if (!user?._id) {
                return
            }
            // create new conversation
            const newConversation = {
                mode: 'system_chatbot',
                promptKey: promptKey,
                userId: user._id,
                isActive: true
            }
            // create new conversation
            createConversation(newConversation)
        }
        
    }, [conversation])
  return (
    <>
        <Header>
            <Search />
            <div className='ml-auto flex items-center gap-4'>
                <ThemeSwitch />
                <ProfileDropdown />
            </div>
        </Header>

        {/* ===== Content ===== */}
      <Main fixed>
        <Breadcrumbs list={[{title: 'Home', url: '/'}, {title: 'Apps', url: '/apps'}, {title: 'Create new app', url: ''}]}/>
        <div className='mb-2 flex items-center justify-between space-y-2'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight'>Create new app</h1>
                <p className='text-muted-foreground'></p>
            </div>

        </div>
       
        <Separator className='shadow-sm' />
        {/* <CreateAppForm /> */}
        {conversation && <Chat conversation={conversation} conversationKey={conversationKey} promptKey={promptKey} avatar={avatar} name={'Assistant'} description={'Assistant is a chatbot that can help you create your app.'} />}
      </Main>
    </>
    
  );
};

const CreateAppForm = () => {
    const {toggleMediaModal} = useModalStore()
    const form = useForm<AppFormValues>({
        resolver: zodResolver(appSchema),
        defaultValues: {
            name: '',
            description: '',
            type: 'chatbot',
            isActive: true,
            isPublic: false,
            virtualRoles: [],
            prompt: '',
            cover: '',
            logo: ''
        },
      });
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createApp: any = useMutationWithAuth('post', '/app/apps', {
          onSuccess: () => {
            // eslint-disable-next-line no-console
            console.log('create app success')
          },
        });
    
      const onSubmit = (data: AppFormValues) => {
        createApp.mutate(data)
      }

    return (
        <div className='faded-bottom no-scrollbar gap-4 overflow-auto pt-4 pb-16'>
            <div className='flex justify-end'>
                <Button className='space-x-1' onClick={form.handleSubmit(onSubmit)}>
                    <span>Create App</span>
                </Button>
            </div>
            <Form {...form}>
                <form>
                    <div className="pt-4 space-y-8 grid gap-8 md:grid-cols-2">
                        <div className='space-y-8'>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>App name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    App's name
                                </FormDescription> */}
                                <FormMessage />
                                </FormItem>
                            )}
                            />


                            <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="..." {...field} />
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>App's type</FormLabel>
                                <FormControl>
                                    <Select {...field}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select App type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>App type</SelectLabel>
                                                <SelectItem value="chatbot">Chatbot</SelectItem>
                                                <SelectItem value="multi_step">Multi step</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="virtualRoles"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel><span>Virtual roles</span> <HoverInfo text='Virtual roles are the roles that your app can assume.'/></FormLabel>
                                <FormControl>
                                    <Input placeholder="virtual roles" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className='space-y-8'>
                            <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>App Logo</FormLabel>
                                <FormControl>
                                    <div className='flex flex-col items-center'>
                                        <Avatar className='w-40 h-40'>
                                            <AvatarImage src={field.value} />
                                            <AvatarFallback>Logo</AvatarFallback>
                                        </Avatar>
                                        <Button className='mt-3' onClick={() => toggleMediaModal(true)}>Choose Image</Button>
                                    </div>
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="cover"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cover image</FormLabel>
                                <FormControl>
                                    <Input placeholder="virtual roles" {...field} />
                                </FormControl>
                                
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>App Prompt</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="virtual roles" {...field} className='h-40' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        
                    </div>
                    
                </form>

            </Form>
        </div>
    )
}

export default CreateApp;