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
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

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

  const { data: activeOrganization } = authClient.useActiveOrganization()

  const router = useRouter();

  const { data: organizations } = authClient.useListOrganizations()

  async function onSubmitHandler(data: PostFormValues) {
    startTransition(async () => {
      try {
        if (!activeOrganization) {
          toast.error("No active organization selected");
          return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);
        formData.append("organizationId",activeOrganization?.id);

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
      {/* Show active organization info */}
      {activeOrganization ? (
        <div className="bg-muted/50 p-3 rounded-lg border">
          <p className="text-sm font-medium">
            Posting to: <span className="text-primary">{activeOrganization.name}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            @{activeOrganization.slug}
          </p>
        </div>
      ) : (
        <div className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <p className="text-sm font-medium text-destructive">
            No organization selected
          </p>
          <p className="text-xs text-muted-foreground">
            Please select an organization from the{" "}
            <Link href="/organizations" className="text-primary underline">
              organizations page
            </Link>{" "}
            before creating a post.
          </p>
        </div>
      )}

      {/* Quick org switcher */}
      {organizations && organizations.length > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <span>Switch to:</span>
          {organizations.filter(org => org.id !== activeOrganization?.id).slice(0, 3).map(org => (
            <Button
              type="button"
              key={org.id}
              variant="outline"
              size="sm"
              onClick={() => authClient.organization.setActive({ organizationId: org.id })}
            >
              {org.name}
            </Button>
          ))}
        </div>
      )}

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

      <Button 
        type="submit" 
        disabled={isPending || !activeOrganization} 
        className="mt-4 w-full"
      >
        {isPending ? "Saving Post..." : isEditing ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}

export default PostForm;
