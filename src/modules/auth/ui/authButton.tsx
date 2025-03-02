"use client";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthButton = () => {
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <> 
      <SignedIn>
        <div className="relative" ref={dropdownRef}>

          <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <UserButton showName={false} afterSignOutUrl="/" appearance={{ elements: { userButtonPopoverCard: "hidden" } }} />
          </div>


          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-2xl z-30 border border-gray-200 p-3 transition-all ">
              {/* Studio Option */}
              <button
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/studio");
                }}
              >
                <ClapperboardIcon className="size-5 mr-3 text-blue-500" />
                Studio
              </button>


              <button
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                onClick={() => {
                  setIsOpen(false);
                  openUserProfile();
                }}
              >
                <SettingsIcon className="size-5 mr-3 text-green-500" />
                Manage Account
              </button>

              <div className="border-t my-2"></div>

              {/* Sign Out Option */}
              <button
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-all"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
              >
                <LogOutIcon className="size-5 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" className="px-5 py-3 font-medium text-sm text-blue-600 hover:text-blue-500 shadow-md rounded-full [&_svg]:size-5 transition-all">
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default AuthButton;
