import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable("users",{
   id: varchar("id",{length:255}).primaryKey(),
   name: varchar("name",{length:255}).notNull(),
   email: varchar("email",{length:255}).notNull().unique(),
   emailVerified: boolean('emailVerified').default(false),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable("sessions",{
   id: varchar("id",{length:255}).primaryKey(),
   userId: varchar("user_id",{length:255})
   .references(()=>users.id) // foreign key
   .notNull(),
   token: varchar("token",{length:255}),
   expiresAt: timestamp("expires_at").notNull(),
   ipAddress: varchar("ip_address",{length:255}),
   userAgent: text("user_agent"),
   activeOrganizationId: varchar("active_organization_id", { length: 255 })
   .references(() => organizations.id), // Add this field   
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),   
});

export const accounts = pgTable("accounts",{
   id: varchar("id",{length:255}).primaryKey(),
   userId: varchar("user_id",{length:255})
   .references(()=>users.id) // foreign key
   .notNull(),   
   accountId: varchar("account_id",{length:255}).notNull(),
   providerId: varchar("provider_id",{length:255}).notNull(),
   password: text("password"),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),      
});

export const posts = pgTable("posts",{
   id: serial("id").primaryKey(),
   title: varchar("title",{length:255}).notNull().unique(),
   description: varchar("description",{length:255}).notNull(),
   slug: varchar("slug",{length:255}).notNull().unique(),
   content: text("content").notNull(),
   authorId: varchar("author_id",{length:255})
   .references(()=>users.id)
   .notNull(),
   organizationId: varchar("organization_id",{length:255})
   .references(()=>organizations.id)
   .notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),      
});

export const organizations = pgTable("organization", {
   id: varchar("id",{length:255}).primaryKey(),
   name: varchar("name",{length:255}).notNull(),
   slug: varchar('slug',{length:255}).notNull().unique(),
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const members = pgTable("member",{
   id: varchar('id',{length:255}).primaryKey(),
   userId: varchar('user_id',{length:255})
   .references(()=>users.id)
   .notNull(),
   organizationId: varchar('organization_id',{length:255})
   .references(()=>organizations.id)
   .notNull(),
   role: varchar("role", { length: 50 }).notNull(), // owner, admin, member
   createdAt: timestamp('created_at').defaultNow().notNull(),   
})

export const invitations = pgTable('invitation',{
   id: varchar('id',{length:255}).primaryKey(),
   email: varchar('email',{length:255}).notNull(),
   inviterId: varchar('inviter_id',{length:255})
   .references(()=>users.id)
   .notNull(),
   organizationId: varchar('organization_id',{length:255})
   .references(()=>organizations.id)
   .notNull(),
   role: varchar("role", { length: 50 }).notNull(),
   status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, accepted, rejected, canceled
   expiresAt: timestamp("expires_at").notNull(),
   createdAt: timestamp('created_at').defaultNow().notNull(),      
})

// Fix: usersRelations should be for users, not posts
export const usersRelations = relations(users, ({ many }) => ({
   posts: many(posts),
   accounts: many(accounts),
   sessions: many(sessions),
   memberships: many(members),
   sentInvitations: many(invitations),
}));

// posts belong to one author and one organization
export const postsRelations = relations(posts,({one})=>({
    author: one(users, {
      fields: [posts.authorId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [posts.organizationId],
      references: [organizations.id],
    }),
}));

// every account belongs to one user
export const accountsRelations = relations(accounts,({one})=>({
   user: one(users, {
      fields: [accounts.userId],
      references: [users.id],
   }),
})); 

// every session for one user
export const sessionRelations = relations(sessions,({one})=>({
   user: one(users, {
      fields: [sessions.userId],
      references: [users.id],
   }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
   members: many(members),
   invitations: many(invitations),
   posts: many(posts),
}));

export const membersRelations = relations(members, ({ one }) => ({
   user: one(users, {
      fields: [members.userId],
      references: [users.id],
   }),
   organization: one(organizations, {
      fields: [members.organizationId],
      references: [organizations.id],
   }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
   inviter: one(users, {
      fields: [invitations.inviterId],
      references: [users.id],
   }),
   organization: one(organizations, {
      fields: [invitations.organizationId],
      references: [organizations.id],
   }),
}));

export const schema = {
   users,
   sessions,
   accounts,
   posts,
   organizations,
   members,
   invitations,   
};

