"use-client"
import { Button } from "@/components/ui/button"
import { UserCircleIcon } from "lucide-react"
import { UserButton,SignInButton,SignedIn,SignedOut } from "@clerk/nextjs"


const AuthButton = () => {

  return (
      <> 
      <SignedIn>
        <UserButton/>
        {/* Add menu items and studio and user profile */}
      </SignedIn>
      <SignedOut>
 <SignInButton mode="modal">
    <Button variant="outline" className="px-4 py-2 font-medium text-sm text-blue-600 hover:text-blue-500 shadow-none rounded-full [&_svg]:size-4">
        <UserCircleIcon/>
        Sign in
    </Button>
    </SignInButton>
    </SignedOut>
    
    </>
  )
}

export default AuthButton