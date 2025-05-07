import {
  IconBrowserCheck,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
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
      items: [
        // {
        //   title: 'Dashboard',
        //   url: '/',
        //   icon: IconLayoutDashboard,
        // },
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
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
