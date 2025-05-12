import { createFileRoute } from '@tanstack/react-router'
import TypeConfigPage from '@/features/app-config/type'

export const Route = createFileRoute('/_admin/app-config/type')({
  component: TypeConfigPage,
})
