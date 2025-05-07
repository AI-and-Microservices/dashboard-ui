import {
  IconHelp,
  IconPackages,
  IconSettings,
  IconTrendingUp,
  IconMessageChatbot,
  IconLinkPlus
} from '@tabler/icons-react'
import { Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'KhangPV',
    email: 'vkphambn@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Personal',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Team',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navGroups: [
    {
      title: 'Discover',
      role: 'user',
      items: [
        {
          title: 'Trending Apps',
          url: '/discover',
          icon: IconTrendingUp,
        },
      ],
    },
    {
      title: 'Workspace',
      role: 'user',
      items: [
        {
          title: 'Apps',
          url: '/apps',
          icon: IconPackages,
        },
        {
          title: 'Virtual Roles',
          url: '/virtual-roles',
          icon: IconMessageChatbot,
        },
        {
          title: 'Integrations',
          url: '/integrations',
          icon: IconLinkPlus,
        },
      ],
    },
    {
      title: 'Admin',
      role: 'admin', 
      items: [
        {
          title: 'Prompts',
          icon: IconSettings,
          url: '/prompts',
          
        },
        {
          title: 'App config',
          url: '/app-config',
          icon: IconHelp,
        },
      ],
    },
  ],
}
