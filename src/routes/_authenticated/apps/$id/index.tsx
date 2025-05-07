import { createFileRoute } from '@tanstack/react-router'
import AppDetail from '@/features/apps/$id'

export const Route = createFileRoute('/_authenticated/apps/$id/')({
  component: AppDetail,
})
