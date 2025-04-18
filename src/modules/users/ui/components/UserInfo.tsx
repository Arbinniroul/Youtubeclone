import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
const userInfoVariants=cva("flex items-center gap-1 ",{
    variants:{
        size:{
            default:"[_&p]:text-sm [&_svg]:size-4",
            lg:"[&_p]:text-base [&svg]:size-5 [&_p]:font-medium [&_p]:text-black ",
            samll:"[_&p]:text-xs [&_svg]:size-3.5",
            
        }
    },
    defaultVariants:{
        size:'default',
    }
})

interface userInfoProps extends VariantProps<typeof userInfoVariants>{
    name:string,
    classname?:string

}
export const UserInfo=({name,classname,size}:userInfoProps)=>{
    return (
        <div className={cn(userInfoVariants({size,classname}))}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-gray-500 line-clamp-1 hover:text-gray-800">
                        {name}
                    </p>
                </TooltipTrigger>
                <TooltipContent align="center" className="bg-black/70 ">
                    <p className="text-center">{name}</p>
                </TooltipContent>
            </Tooltip>

        </div>
    )
}