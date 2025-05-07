import { createFileRoute } from '@tanstack/react-router'
import CreateApp from '@/features/apps/createApp'

export const Route = createFileRoute('/_authenticated/apps/create-app')({
  component: CreateApp,
})
