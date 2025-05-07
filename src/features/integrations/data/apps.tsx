import {
  IconBrandDiscord,
  IconBrandMessenger,
  IconBrandSlack,
  IconBrandTelegram,
  IconBrandWhatsapp,
} from '@tabler/icons-react'

export const apps = [
  {
    name: 'Messenger',
    logo: <IconBrandMessenger />,
    connected: false,
    desc: 'Connect with Messenger for real-time communication with clients',
  },
  {
    name: 'Telegram',
    logo: <IconBrandTelegram />,
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Slack',
    logo: <IconBrandSlack />,
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Discord',
    logo: <IconBrandDiscord />,
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    logo: <IconBrandWhatsapp />,
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]
