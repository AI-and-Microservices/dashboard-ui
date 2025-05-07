import { createFileRoute } from '@tanstack/react-router'
import Prompts from '@/features/prompts'

export const Route = createFileRoute('/_admin/prompts/')({
  component: Prompts,
})
