import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"


const AuthButton = () => {
    //TODO: add different auth states
  return (
    <Button variant="outline" className="px-4 py-2 font-medium text-sm text-blue-600 hover:text-blue-500 shadow-none rounded-full [&_svg]:size-4">
        <UserCircleIcon/>
        Sign in
    </Button>
  )
}

export default AuthButton