import { desc, eq } from "drizzle-orm";
import { db } from ".";
import { organizations, posts } from "./schema";



// get all posts
export async function getAllPosts(){
   try {
      const allPosts = await db.query.posts.findMany({
         orderBy: [desc(posts.createdAt)],
         with: {
            author: true,
         },
      });

      return allPosts;
   } catch (e) {
      console.log(e);
      return [];
   }
}

// get post by slug (Can do it by id also but slug is also unique and we are validating it when creating post)
export async function getPostBySlug(slug: string){
   try {
      const post = await db.query.posts.findFirst({
         where: eq(posts.slug,slug),
         with: {
            author: true,
         },
      });

      return post;
   } catch (e) {
      console.log(e);
      return null;
   }
}

// get organization by slug with posts and authors
export async function getOrganizationBySlug(slug:string){
   try {
      const orgs = await db.query.organizations.findFirst({
         where: eq(organizations.slug,slug),
         with: {
            posts: {
               orderBy: [desc(posts.createdAt)],
               with: {
                  author: true,
               }
            },
         },
      });

      return orgs;
   } catch (e) {
      console.log(e);
      return null;      
   }
}