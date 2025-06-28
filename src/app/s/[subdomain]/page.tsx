import { getOrganizationBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import Container from "@/components/layout/container";
import PostCard from "@/components/post/post-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Calendar, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    subdomain: string;
  };
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = await params;
  
  // Get organization and its posts
  const organization = await getOrganizationBySlug(subdomain);

  // If organization doesn't exist, show 404
  if (!organization) {
    notFound();
  }

  const posts = organization.posts || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Organization Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <Container>
          <div className="py-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{organization.name}</h1>
                <p className="text-muted-foreground text-lg">@{organization.slug}</p>
              </div>
            </div>

            {/* Organization Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{posts.length}</p>
                      <p className="text-sm text-muted-foreground">
                        {posts.length === 1 ? 'Post' : 'Posts'} Published
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {new Date(organization.createdAt).getFullYear()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Est. {new Date(organization.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">Team</p>
                      <p className="text-sm text-muted-foreground">
                        Organization Blog
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      {/* Posts Section */}
      <Container>
        <div className="py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Latest Posts</h2>
              <p className="text-muted-foreground mt-2">
                Discover the latest content from {organization.name}
              </p>
            </div>
            
            <Button asChild className="hidden md:flex">
              <Link href={`${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Explore Public Posts
              </Link>
            </Button>
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    slug: post.slug,
                    createdAt: post.createdAt,
                    author: {
                      name: post.author.name
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="mb-2">No Posts Yet</CardTitle>
                <CardDescription className="mb-6">
                  {organization.name} hasn't published any posts yet. Check back later for updates!
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>

      {/* Organization Footer */}
      <div className="bg-muted/50 border-t">
        <Container>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              This is the dedicated space for <strong>{organization.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              All content on this page belongs exclusively to this organization
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}