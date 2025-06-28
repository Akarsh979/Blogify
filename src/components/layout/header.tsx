'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import UserMenu from "../auth/user-menu";
import ThemeToggle from "../theme/theme-toggle";
import { useEffect, useState } from "react";

function Header(){

   const router = useRouter();
   const [isSubdomain, setIsSubdomain] = useState(false);

   const {data:session,isPending} = useSession();

   // Check if we're on a subdomain
   useEffect(() => {
      const checkSubdomain = () => {
         if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            // const isOnSubdomain = hostname.includes('.
            // localhost') && !hostname.startsWith('localhost');
            const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
            const rootDomainHost = rootDomain.split(':')[0]; // Remove port if present
            
            // Check if current hostname is a subdomain of the root domain
            const isOnSubdomain = hostname !== rootDomainHost && 
                                hostname !== `www.${rootDomainHost}` &&
                                hostname.endsWith(`.${rootDomainHost}`);
            setIsSubdomain(isOnSubdomain);
         }
      };

      checkSubdomain();
      // Listen for navigation changes
      window.addEventListener('popstate', checkSubdomain);
      
      return () => {
         window.removeEventListener('popstate', checkSubdomain);
      };
   }, []);
 
   const navItems = [
      {
         label: "Home",
         href: "/"
      },
      {
         label: "Create",
         href: "/post/create"
      },
      {
         label: "Organizations",
         href: "/organizations"
      }
   ]

   return (
      <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-6">  
      <Link href="/" className="font-bold text-xl">NextJs 15 Blog App</Link>
      
      {/* Only show navigation on main domain */}
      {!isSubdomain && (
         <nav className="hidden md:flex items-center gap-6">
         {navItems.map((navItem)=>(
         <Link 
         key={navItem.href} 
         href={navItem.href}
         className={cn("text-sm font-medium transition-colors hover:text-primary")}
         >{navItem.label}
         </Link>
         ))}
         </nav>
      )}
      </div> 

      <div className="flex items-center gap-4">
         <div className="hidden md:block">
            {/* Keep a placeholder for search */}
         </div>
         <ThemeToggle/>
         
         {/* Only show user menu/login on main domain */}
         {!isSubdomain && (
            <div className="flex items-center gap-2">
             {isPending ? null : session?.user ? (
               <UserMenu user={session?.user}/>
             ):(
               <Button className="cursor-pointer" variant={'default'} onClick={()=>(router.push("/auth"))}>
             Login
             </Button>
             )}
            </div>
         )}
      </div>

      </div>
      </header>
   )
}

export default Header;