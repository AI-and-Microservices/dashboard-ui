import { useMutationWithAuth, useQueryWithAuth } from '@/lib/useQueryWithAuth'
import { CreateAppTypeModal } from './CreateAppTypeModal'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'


export default function TypeList() {
    const [isOpen, setIsOpen] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, refetch }: { data: any, refetch: () => void } = useQueryWithAuth(["prompts"], "/prompt/admin/prompts")
    const [editingPrompt, setEditingPrompt] = useState(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const prompts = data?.data || []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prompts.map((prompt: any) => (
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

        <DeleteTypeModal open={!!confirmDeleteId} onSuccess={() => { setConfirmDeleteId(null); refetch() }} confirmDeleteId={confirmDeleteId} onClose={() => setConfirmDeleteId(null)} />

        <CreateAppTypeModal open={isOpen} onClose={() => setIsOpen(false)} defaultValues={editingPrompt} refetch={refetch} />
      </div>
    )
}


const DeleteTypeModal = ({open, onSuccess, confirmDeleteId, onClose}: {open: boolean, onSuccess: () => void, confirmDeleteId: string | null, onClose: () => void}) => {
    const deleteType = useMutationWithAuth("delete", `/prompt/admin/prompts/${confirmDeleteId}`)

    const onDelete = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await deleteType.mutateAsync(); 
        if (res.success) {
            toast.success("Type deleted successfully")
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