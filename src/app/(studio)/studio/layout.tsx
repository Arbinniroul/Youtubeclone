
import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout"


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