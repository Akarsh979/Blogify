"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { createPost, updatePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostFormProps } from "@/lib/types";

// Post form schema for validation
const postSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(255, "Description must be less than 255 characters"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
});

type PostFormValues = z.infer<typeof postSchema>;

function PostForm({ isEditing, post }: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: isEditing && post
      ? {
          title: post?.title,
          description: post?.description,
          content: post?.content,
        }
      : {
          title: "",
          description: "",
          content: "",
        },
  });

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  async function onSubmitHandler(data: PostFormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);

        let res;

        if(isEditing && post){
           res = await updatePost(post.id,formData);
        }else{
           res = await createPost(formData);
        }

        console.log("result", res);

        if (res.success) {
          toast(isEditing ? "Post edited successfully" : "Post created successfully");
          router.refresh();
          router.push("/");
        } else {
          toast(res.message);
        }
      } catch (error) {
        toast("Failed to create post");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter post title"
          {...register("title")}
          disabled={isPending}
        />
        <span className="text-sm text-red-700">{errors?.title?.message}</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a short post description"
          {...register("description")}
          disabled={isPending}
        />
        <span className="text-sm text-red-700">
          {errors?.description?.message}
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          className="min-h-[250px] resize-none"
          id="content"
          placeholder="Enter post content "
          {...register("content")}
          disabled={isPending}
        />
        <span className="text-sm text-red-700">{errors?.content?.message}</span>
      </div>

      <Button type="submit" disabled={isPending} className="mt-4 w-full">
        {isPending ? "Saving Post..." : isEditing ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}

export default PostForm;
