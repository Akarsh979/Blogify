"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  try {
    // get the current user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user) {
      return {
        success: false,
        message: "You must be logged in to create a post",
      };
    }

    // get form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    // Validation check for title,description,content
    if (
      !title ||
      title.length < 2 ||
      !description ||
      description.length < 5 ||
      !content ||
      content.length < 10
    ) {
      return {
        success: false,
        message:
          "Invalid input: Please check title, description, and content length.",
      };
    }

    // create the slug from the post title
    const slug = slugify(title);

    // check if the slug already exists
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existingPost) {
      return {
        success: false,
        message:
          "A post with same title already exists! Please try with a different title",
      };
    }

    // Create new post in db
    // This returns an array after inserting, so [newPost] captures the first element
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    /* revalidate(refresh) the homepage to get the latest posts
      1. In React: No built-in caching of pages/data. But in Next.js (with the App Router and server components), when you navigate to a page like the homepage, the data is often served from the cache if it was previously rendered and cached by the server.
      
      2. Without revalidation: If you create a new post and then go to the homepage, you might see old data because the homepage is still serving the cached version.

      3. With revalidatePath("/"): You tell Next.js to clear the cache for the homepage. The next time you (or anyone) visit the homepage, it will fetch fresh data from the database and update the cache. */
    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post Created Successfully",
      slug,
    };
  } catch (e) {
    console.log("Failed to create new post",e);
    return {
      success: false,
      message: "Failed to create new post",
    };
  }
}

export async function updatePost(postId: number, formData: FormData) {
   try {
     const session = await auth.api.getSession({
       headers: await headers(),
     });
     
     if(!session || !session.user){
        return {
          success: false,
          message: "You must be logged in to edit a post!",
        }
     }

    // get form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    // Validation check for title,description,content
    if (
      !title ||
      title.length < 2 ||
      !description ||
      description.length < 5 ||
      !content ||
      content.length < 10
    ) {
      return {
        success: false,
        message:
          "Invalid input: Please check title, description, and content length.",
      };
    }

    // create the slug from the post title
    const slug = slugify(title);   
    
    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.slug,slug),ne(posts.id,postId))
    })

    if(existingPost){
      return {
         sucess: false,
         message: "A post with this title already exists!"
      }
    }

    const post = await db.query.posts.findFirst({
      where: eq(posts.id,postId)
    })

    if(post?.authorId !== session.user.id){
        return {
         success: false,
         message: "You can only edit your own post!"
        }
    }

    await db.update(posts).set({
      title, description, content, slug, updatedAt: new Date()
    }).where(eq(posts.id,postId));

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath('/profile');

    return {
      success: true,
      message: "Post edited successfully",
      slug,
    }
   } catch (e) {
      console.log("Failed to edit the post",e);
      return {
         success: false,
         message: "Failed to edit the post",
      }
   }
}

export async function deletePost(postId:number){
   try {
     const session = await auth.api.getSession({
      headers: await headers(),
     })  

     if(!session || !session.user){
       return {
         success: false,
         message: "You must be logged in to delete the post",
       }
     }

     const postToDelete = await db.query.posts.findFirst({
      where: eq(posts.id,postId)
     })

     if(postToDelete?.authorId !== session.user.id){
      return {
         success: true,
         message: "You can only delete your own posts!"
      }
     }

     await db.delete(posts).where(eq(posts.id,postId));

     revalidatePath("/");
     revalidatePath("/profile");

     return {
      success: true,
      message: "Post Deleted Successfully",
     }

   } catch (error) {
      console.log("Failed to delete the post",error);

      return {
         success: false,
         message: "Failed to delete the post",
      }
   }
}