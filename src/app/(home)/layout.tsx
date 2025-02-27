import { HomeLayout } from "@/modules/home/ui/layouts/homeLayout"


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