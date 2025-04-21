import { HomeLayout } from "@/modules/home/ui/layouts/homeLayout"

export const dynamic="force-dynamic"
interface layoutProps{
    children:React.ReactNode
}



const layout = ({children}:layoutProps) => {
  return (
    <HomeLayout>
        {children}
    </HomeLayout>
  )
}

export default layout