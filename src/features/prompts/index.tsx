import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useMutationWithAuth, useQueryWithAuth } from '@/lib/useQueryWithAuth'
import { AdminPromptModal } from './CreatePromptModal'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function Prompts() {
    

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Prompts management</h2>
            <p className='text-muted-foreground'>
              Manage system, role, template and app prompts.
            </p>
          </div>
          
          <div className='flex gap-2'></div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <AdminPromptList />
        </div>
        
      </Main>

    </>
  )
}

export function AdminPromptList() {
    const [isOpen, setIsOpen] = useState(false)
    const { data, refetch }: { data: any, refetch: () => void } = useQueryWithAuth(["prompts"], "/prompt/admin/prompts")
    const [editingPrompt, setEditingPrompt] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const prompts = data?.data || []
    const onEdit = (prompt: any) => {
      setEditingPrompt(prompt)
      setIsOpen(true)
    }
    
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Prompts</h2>
          <Button onClick={() => { setEditingPrompt(null); setIsOpen(true) }}>New Prompt</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prompts.map((prompt: any) => (
              <TableRow key={prompt._id}>
                <TableCell>{prompt.name}</TableCell>
                <TableCell>{prompt.key}</TableCell>
                <TableCell>{prompt.type}</TableCell>
                <TableCell>{prompt.status}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(prompt)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDeleteId(prompt._id)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DeletePromptModal open={!!confirmDeleteId} onSuccess={() => { setConfirmDeleteId(null); refetch() }} confirmDeleteId={confirmDeleteId} onClose={() => setConfirmDeleteId(null)} />

        <AdminPromptModal open={isOpen} onClose={() => setIsOpen(false)} defaultValues={editingPrompt} refetch={refetch} />
      </div>
    )
  }
  

  const DeletePromptModal = ({open, onSuccess, confirmDeleteId, onClose}: {open: boolean, onSuccess: () => void, confirmDeleteId: string | null, onClose: () => void}) => {
    const deletePrompt = useMutationWithAuth("delete", `/prompt/admin/prompts/${confirmDeleteId}`)

    const onDelete = async () => {
        const res: any = await deletePrompt.mutateAsync(); 
        if (res.success) {
            toast.success("Prompt deleted successfully")
            onSuccess()
        }
    }
    
    return (
        <Dialog open={open}>
            <DialogContent className="max-w-md w-full">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <p>Are you sure you want to delete this prompt? This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => onClose}>Cancel</Button>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
                </div>
            </div>
            </DialogContent>
        </Dialog>
    )
  }