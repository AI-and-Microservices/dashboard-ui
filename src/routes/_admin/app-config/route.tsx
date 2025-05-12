import { createFileRoute } from '@tanstack/react-router'
import AppConfig from '@/features/app-config'

export const Route = createFileRoute('/_admin/app-config')({
  component: AppConfig,
})
