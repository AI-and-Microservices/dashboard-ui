import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutationWithAuth } from "@/lib/useQueryWithAuth"
import { useEffect } from "react"
import { toast } from "sonner"
const promptSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["role", "system", "template", "app"]),
  isPublic: z.boolean().default(false),
  status: z.enum(["active", "inactive"])
})

export function AdminPromptModal({ open, onClose, defaultValues, refetch }: { open: boolean; onClose: () => void; defaultValues?: any; refetch: () => void }) {
    const isEdit = Boolean(defaultValues?._id)
    const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: "",
      key: "",
      content: "",
      type: "role",
      isPublic: false,
      status: "active"
    }
  })
  const createPrompt: any = useMutationWithAuth("post", "/prompt/admin/prompts")
  const editPrompt: any = useMutationWithAuth("put", `/prompt/admin/prompts/${defaultValues?._id || ""}`)

  const onSubmit = async (data: z.infer<typeof promptSchema>) => {
    let res: any;
        if (isEdit) {
            res = await editPrompt.mutateAsync(data)
        } 
        else {
            res = await createPrompt.mutateAsync(data)
        }
        console.log(res)
        if (res?.success) {
            reset()
            refetch()
            onClose()
        }
        else {
            toast.error(res?.message)
        }
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Prompt" : "Create New Prompt"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

          <Input placeholder="Key (optional, only for system prompts)" {...register("key")} />

          <Textarea placeholder="Prompt content" rows={4} {...register("content")} />
          {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={(value) => setValue("type", value as "role" | "system" | "template" | "app")} defaultValue={defaultValues?.type || "system"}>
              <SelectTrigger>
                <SelectValue placeholder="Prompt Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="app">App</SelectItem>
              </SelectContent>
            </Select>

          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Public</label>
            <Switch onCheckedChange={(val) => setValue("isPublic", val)} />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm">Status</label>
            <Select onValueChange={(value) => setValue("status", value as "active" | "inactive")} defaultValue="active">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
