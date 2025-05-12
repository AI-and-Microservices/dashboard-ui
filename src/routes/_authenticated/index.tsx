import { createFileRoute } from '@tanstack/react-router'
import Apps from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: Apps,
})
