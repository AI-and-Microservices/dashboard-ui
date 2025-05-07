import {useState, useCallback} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore"
import { useMediaStore } from "@/stores/mediaStore"

const formSchema = z.object({
    file: z
      //Rest of validations done via react dropzone
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });


export const ImageUploader = () => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const { toggleMediaModal } = useModalStore()
    const {trigger} = useMediaStore()
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      file: new File([""], "filename"),
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("file", acceptedFiles[0]);
        form.clearErrors("file");
      } catch (error) {
        setPreview(null);
        form.resetField("file");
      }
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 10000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    const handleUpload = () => {
        // Giả lập upload thành công và lấy link preview để demo
        alert("Image uploaded (mock)")
    }

    const handleUploadAndUse = () => {
        console.log('handleUploadAndUse')
    }

    const upload = (values: any) => {
        console.log(values)
    }

  return (
    <>
        <div
          className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="file"
                render={() => (
                    <FormItem className="mx-auto max-w-[100%]">
                    <FormControl>
                        <div
                        {...getRootProps()}
                        className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2"
                        >
                        {preview && (
                            <img
                            src={preview as string}
                            alt="Uploaded image"
                            className="rounded-lg max-h-[500px]"
                            />
                        )}
                        <ImagePlus
                            className={`size-40 ${preview ? "hidden" : "block"}`}
                        />
                        <Input {...getInputProps()} type="file" />
                        {isDragActive ? (
                            <p>Drop the image!</p>
                        ) : (
                            <p>Click here or drag an image to upload it</p>
                        )}
                        </div>
                    </FormControl>
                    <FormMessage>
                        {fileRejections.length !== 0 && (
                        <p>
                            Image must be less than 1MB and of type png, jpg, or jpeg
                        </p>
                        )}
                    </FormMessage>
                    </FormItem>
                )}
                />
            </form>
            </Form>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => toggleMediaModal(false)}>Close</Button>
          <Button onClick={handleUpload} disabled={!preview || isUploading}>Upload</Button>
          <Button onClick={handleUploadAndUse} disabled={!preview || isUploading}>Upload & Use Image</Button>
        </div>
    </>
    
  );
};