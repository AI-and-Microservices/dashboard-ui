import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
    title: string
    url: string
}

export function Breadcrumbs({list}: {list: BreadcrumbItem[]}) {

return (
    <Breadcrumb className="my-4">
        <BreadcrumbList>
            {
            list.map((item) => (
                <div key={item.title} className="flex items-center gap-1.5">
                    <BreadcrumbItem>
                        {
                        item.url ? <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink> : <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        }
                    </BreadcrumbItem>
                    {item.url ? <BreadcrumbSeparator /> : null}
                </div>
            ))
            }
        </BreadcrumbList>
    </Breadcrumb>
)
}
