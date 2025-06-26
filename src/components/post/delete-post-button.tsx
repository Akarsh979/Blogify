'use client'

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { DeletePostButtonProps } from "@/lib/types";
import { useState } from "react";
import { deletePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DeletePostButton({postId}:DeletePostButtonProps){
   const [isDeleting,setIsDeleting] = useState(false);
   const router = useRouter();
    
   const handleDelete = async () => {
      setIsDeleting(true);
      try {
        const res = await deletePost(postId);

        if(res.success){
          toast(res.message);
          router.push("/");
          router.refresh() 
        }else{
         toast(res.message);
        }
      } catch (e) {
         toast("An error occured while deleting the post! Please try again");
         console.log(e);
      } finally{
         setIsDeleting(false);
      }
   };

   return (
     <div>
      <Button disabled={isDeleting} onClick={handleDelete} variant="destructive" size="sm" className="cursor-pointer">
         <Trash2 className="w-4 h-4 mr-2"/>
         {isDeleting ? "Deleting..." : "Delete"}
      </Button>
     </div>
   )
}

export default DeletePostButton;