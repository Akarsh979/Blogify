# 📝 Multi-Tenant Blog Platform

A modern, multi-tenant blog platform built with Next.js 15, featuring organization-based content management and dynamic subdomain routing.

## ✨ Key Features

### 🏢 **Multi-Tenant Architecture** 
- **Organization-based content isolation**: Each organization has its own dedicated space and content
- **Dynamic subdomain routing**: Organizations get their own subdomains (e.g., `organization.domain.com`)
- **Isolated content management**: Posts and content are scoped to individual organizations
- **Organization switching**: Users can be members of multiple organizations and switch between them

### 📚 **Blog Management**
- **Rich post creation**: Create and edit blog posts with a clean interface
- **Post management**: Full CRUD operations for blog posts
- **Organization-specific posts**: Posts belong to specific organizations
- **Author attribution**: Posts are attributed to their creators

### 👥 **User & Organization Management**
- **User authentication**: Secure login/register with Better Auth
- **Organization creation**: Users can create and manage organizations
- **Organization membership**: Join and manage multiple organizations
- **⚠️ Role-based access**: *Coming soon - Organization-specific permissions*
- **⚠️ Member invitation & management**: *Coming soon - invite users and manage member roles*

### 🎨 **Modern UI/UX**
- **Dark/Light theme**: Toggle between themes with persistent settings
- **Responsive design**: Mobile-first, fully responsive interface
- **Modern components**: Built with shadcn/ui and Tailwind CSS
- **Clean typography**: Optimized reading experience

### 🛡️ **Security & Performance**
- **Server-side rendering**: Fast initial page loads with Next.js 15
- **Database optimization**: Efficient queries with Drizzle ORM
- **Secure authentication**: Session management with Better Auth
- **Edge optimization**: Optimized for Vercel deployment

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon DB)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Deployment**: Vercel

## 🌐 Live Demo

**Deployed App**: [https://blogify-dusky-ten.vercel.app](https://blogify-dusky-ten.vercel.app)

### ⚠️ **Important Note: Multi-Tenant Limitation**

The **subdomain-based multi-tenant feature is NOT available** on the deployed version due to hosting limitations:

- Vercel Free tier doesn't support wildcard subdomains (`*.domain.com`)
- Wildcard subdomain support requires expensive hosting ($20+/month)
- For hobby projects, this cost is prohibitive

### 🔗 **Alternative Access on Deployed Version**

You can still explore organization content on the deployed version using **path-based URLs**:

```
Format: https://blogify-dusky-ten.vercel.app/s/{organization-name}
Example: https://blogify-dusky-ten.vercel.app/s/tech-blog
```

## 🏠 **Local Development Setup**

To experience the **full multi-tenant features** with subdomain routing, run the app locally:

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon DB account)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL='your_postgresql_connection_string'
   BETTER_AUTH_SECRET='your_32_character_secret_key'
   BETTER_AUTH_URL='http://localhost:3000'
   NEXT_PUBLIC_BETTER_AUTH_URL='http://localhost:3000'
   NEXT_PUBLIC_ROOT_DOMAIN='localhost:3000'
   ```

4. **Database setup**
   ```bash
   # Generate database migrations
   npm run db:generate
   
   # Apply migrations
   npm run db:migrate
   
   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - **Main app**: http://localhost:3000
   - **Create account** and **create an organization**
   - **Multi-tenant access**: http://organization-name.localhost:3000

### 🎯 **Testing Multi-Tenant Features Locally**

1. **Register/Login** at `http://localhost:3000`
2. **Create an organization** (e.g., "Tech Blog" → slug: "tech-blog")
3. **Create posts** within that organization
4. **Access organization subdomain**: `http://tech-blog.localhost:3000`
5. **See isolated content** - only that organization's posts appear

## 📁 **Project Structure**

```
src/
├── app/                    # Next.js app router pages
│   ├── s/[subdomain]/     # Dynamic subdomain routes
│   ├── organizations/     # Organization management
│   ├── post/              # Post CRUD operations
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── post/             # Post-related components
│   └── ui/               # Base UI components
├── lib/                  # Utilities and configurations
│   ├── db/               # Database schema and queries
│   └── auth.ts           # Authentication configuration
└── middleware.ts         # Subdomain routing logic
```

## 🔧 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Apply database migrations
npm run db:push      # Push schema changes directly
npm run db:studio    # Open Drizzle Studio
```

## 🌟 **Key Multi-Tenant Features**

### Subdomain Detection
The middleware automatically detects subdomains and routes to organization-specific content:
- `localhost:3000` → Main app
- `org.localhost:3000` → Organization "org" content

### Content Isolation
- Organizations have isolated post collections
- Users can create posts within specific organizations
- Organization switching maintains user context

### Dynamic Routing
- Each organization gets its own dedicated subdomain
- Automatic routing based on subdomain detection
- Fallback to path-based routing for deployment


