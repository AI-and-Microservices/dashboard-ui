import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { useModalStore } from "@/stores/modalStore"
  import { useMediaStore } from "@/stores/mediaStore"
  import { useState } from "react"
  import { Button } from "@/components/ui/button"
  import { cn } from "@/lib/utils"
  import { ImageUploader } from "./image-uploader"
  
  const mockImages = [
    "/images/sample1.jpg",
    "/images/sample2.jpg",
    "/images/sample3.jpg",
    "/images/sample4.jpg",
  ]
  
  const Library = () => {
    const [selected, setSelected] = useState<string | null>(null)
    const trigger = useMediaStore((state) => state.trigger)
  
    return (
      <div className="grid grid-cols-3 gap-4">
        {mockImages.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelected(img)}
            className={cn(
              "cursor-pointer border-2 p-1",
              selected === img ? "border-blue-500" : "border-transparent"
            )}
          >
            <img src={img} alt="media" className="rounded w-full h-auto" />
          </div>
        ))}
        <div className="col-span-3 flex justify-end mt-4">
          <Button disabled={!selected} onClick={() => selected && trigger(selected)}>
            Choose this image
          </Button>
        </div>
      </div>
    )
  }
  
  const MediaBox = () => {
  
    return (
      <div className="space-y-4">
        <ImageUploader/>
      </div>
    )
  }
  
  const MediaLibrary = () => {
    const { isMediaLibraryOpen, toggleMediaModal } = useModalStore()
  
    return (
      <Dialog open={isMediaLibraryOpen} onOpenChange={toggleMediaModal}>
        <DialogContent className="max-w-3xl min-w-2xl">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
        
            <Tabs defaultValue="library" className="w-full">
                <TabsList>
                    <TabsTrigger value="library">Library</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="library">
                    <Library />
                </TabsContent>
                <TabsContent value="upload">
                    <MediaBox />
                </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default MediaLibrary
  