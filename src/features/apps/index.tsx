import {
  IconPlus,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Breadcrumbs } from '@/components/breadcrumb'
import { useQueryWithAuth } from '@/lib/useQueryWithAuth'
import {apps} from './data/apps'
import { Link } from '@tanstack/react-router'

export default function Apps() {
  const { data, isLoading, error } = useQueryWithAuth(['user'], '/app/apps');
  console.log(error)
  console.log(isLoading)
  console.log(data)
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <Breadcrumbs list={[{title: 'Home', url: '/'}, {title: 'Apps', url: ''}]}/>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              App Integrations
            </h1>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your apps for the integration!
            </p>
          </div>
          <div>
            <Button className='space-x-1'>
              <Link to='/apps/create-app' className='space-x-1 flex items-center'>
                <span>Create</span> <IconPlus size={18} />
              </Link>
            </Button>
          </div>
        </div>
       
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {apps.map((app) => (
            <li
              key={app.name}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`bg-muted flex size-10 items-center justify-center rounded-lg p-2`}
                >
                  {app.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${app.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {app.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{app.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{app.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}
