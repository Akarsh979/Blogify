'use client'

import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

export default function CreateOrganizationPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isPendingSubmit, startTransition] = useTransition()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  })

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth")
    }
  }, [session, isPending, router])

  // Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: slugify(formData.name)
      }))
    }
  }, [formData.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Organization name is required")
      return
    }

    if (formData.name.length < 2) {
      toast.error("Organization name must be at least 2 characters long")
      return
    }

    if (formData.name.length > 255) {
      toast.error("Organization name must be less than 255 characters")
      return
    }

    startTransition(async () => {
      try {
        const result = await authClient.organization.create({
          name: formData.name.trim(),
          slug: formData.slug
        })

        toast.success("Organization created successfully!")
        router.push("/organizations")
        
      } catch (error: any) {
        console.error("Failed to create organization:", error)
        
        // Handle specific Better Auth errors
        if (error?.message?.includes("slug")) {
          toast.error("An organization with this name already exists. Please choose a different name.")
        } else if (error?.message?.includes("permission")) {
          toast.error("You don't have permission to create organizations.")
        } else {
          toast.error("Failed to create organization. Please try again.")
        }
      }
    })
  }

  if (isPending) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Container>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Organizations
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl">Create Organization</CardTitle>
              <CardDescription>
                Start collaborating with your team by creating a new organization
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter organization name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isPendingSubmit}
                    className="text-lg"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground">
                    This will be the display name for your organization
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Organization Slug</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      disabled={isPendingSubmit}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">
                    .{process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}  
                    </span>                    
                  </div>
                  <p className="text-sm text-muted-foreground">
                    URL-friendly version of your organization name (auto-generated)
                  </p>
                </div>


                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You'll be set as the organization owner</li>
                    <li>• You can invite team members (coming soon)</li>
                    <li>• Create posts within this organization</li>
                    <li>• Manage roles and permissions (coming soon)</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1"
                    disabled={isPendingSubmit}
                  >
                    <Link href="/organizations">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPendingSubmit || !formData.name.trim()}
                  >
                    {isPendingSubmit ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Organization"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}
