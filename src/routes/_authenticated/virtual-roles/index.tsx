import { createFileRoute } from '@tanstack/react-router'
import VirtualRoles from '@/features/virtual-roles'

export const Route = createFileRoute('/_authenticated/virtual-roles/')({
  component: VirtualRoles,
})
