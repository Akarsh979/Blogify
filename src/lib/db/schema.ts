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
   createdAt: timestamp('created_at').defaultNow().notNull(),
   updatedAt: timestamp('updated_at').defaultNow().notNull(),      
});

// Doubt here
export const usersRelations = relations(posts,({ one })=>({
    author: one(users, {
      fields: [posts.authorId],
      references: [users.id],
    }),
}));

// one author(user) per post
export const postsRelations = relations(posts,({one})=>({
    author: one(users, {
      fields: [posts.authorId],
      references: [users.id],
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

export const schema = {
   users,
   sessions,
   accounts,
   posts,
};

