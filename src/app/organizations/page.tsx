'use client'

import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Users, Calendar, Check } from "lucide-react"

export default function OrganizationsPage() {
  const { data: session, isPending } = useSession()
  const { data: organizations, isPending: isOrgsPending } = authClient.useListOrganizations()
  const router = useRouter()
  const { data: activeOrganization } = authClient.useActiveOrganization()  

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/auth")
    }
  }, [session, isPending, router])

  function isOrgActive(orgId:string):Boolean{
   return activeOrganization?.id === orgId;
}

  if (isPending || isOrgsPending) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading organizations...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-muted-foreground mt-2">
              Manage your organizations and collaborate with your team
            </p>
          </div>
          <Button asChild>
            <Link href="/organizations/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Link>
          </Button>
        </div>

        {!organizations || organizations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Organizations Yet</CardTitle>
              <CardDescription className="mb-4">
                You haven't joined any organizations yet. Create your first organization to get started.
              </CardDescription>
              <Button asChild>
                <Link href="/organizations/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Organization
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{org.name}</CardTitle>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {/* {org.role} */}
                      Owner
                    </span>
                  </div>
                  <CardDescription>@{org.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {/* {org.memberCount || 0} member{(org.memberCount || 0) !== 1 ? 's' : ''} */}
                      0 members
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Created {new Date(org.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button variant="default" size="sm" asChild className="flex-1">
                        <Link href={`/organizations/${org.slug}`}>
                          View Details
                        </Link>
                      </Button>
                      {isOrgActive(org.id) ? (
                        <Button variant="secondary" size="sm" disabled>
                          <Check className="h-4 w-4 mr-1" />
                          Active
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => authClient.organization.setActive({ organizationId: org.id })}
                        >
                          Set Active
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
} 