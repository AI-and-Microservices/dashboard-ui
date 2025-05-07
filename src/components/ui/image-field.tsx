import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ImageFieldProps {
    form: UseFormReturn;
    name: string;
    label: string;
    placeholder: string
}

export const ImageField = ({form, name, label, placeholder}: ImageFieldProps) => {

    return (
        <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Input placeholder={placeholder} {...field}/>
                <Avatar>
                    <AvatarImage src={field.value} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Button>Choose Image</Button>
            </FormControl>
            
            <FormMessage />
            </FormItem>
        )}
        />
    )
}
