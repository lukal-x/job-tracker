"use client";
import { Popover } from "../../../components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Card } from "../../../components/ui/card";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useAuth } from "../hooks/useAuth";

const AVATAR_PLACEHOLDER = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

export default function AuthToggler() {
  const { user, token } = useFirebaseUser();
  const { handleSignIn, handleSignOut } = useAuth();

  return (
    <div>
      <Popover>
        <PopoverTrigger className="flex cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-accent items-center gap-2">
          <img className="w-10 h-10 rounded-lg" src={!user ? AVATAR_PLACEHOLDER : user.photoURL as string} alt="" />
          <div className="grid place-items-start">
           {user ? (
            <>
             <span className="text-gray-600 dark:text-gray-200 text-sm">{user.displayName}</span>
             <span className="text-gray-600 dark:text-gray-200 text-[10px]">{user.email}</span>
            </>
           ): (
            <div className="grid gap-1">
             <div className="bg-gray-200 w-24 h-3 text-sm"></div>
             <div className="bg-gray-200 w-32 h-2 text-[11px]"></div>
            </div>
           )}
          </div>          
        </PopoverTrigger>
        <PopoverContent className="w-32">
          <Card className="p-3">
            {user ? (
              <Button onClick={handleSignOut} ><LogOut />Logout</Button>
            ) : (
              <Button onClick={handleSignIn}><LogIn />Sign in</Button>
            )}
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  ) 
}
