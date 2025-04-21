
import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout"
export const dynamic="force-dynamic"


interface slayoutProps{
    children:React.ReactNode
}



const layout = ({children}:slayoutProps) => {
  return (
    <StudioLayout>
        {children}
    </StudioLayout>
  )
}

export default layout