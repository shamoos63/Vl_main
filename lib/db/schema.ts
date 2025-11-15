import { sql } from 'drizzle-orm';
import { 
  sqliteTable, 
  text, 
  integer, 
  real,
  blob,
  primaryKey,
  uniqueIndex,
  index
} from 'drizzle-orm/sqlite-core';

// ============================================================================
// ADMIN & AUTHENTICATION TABLES
// ============================================================================

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(), // Use bcrypt to hash passwords
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
}, (table) => ({
  usernameIdx: uniqueIndex('admin_username_idx').on(table.username),
  emailIdx: uniqueIndex('admin_email_idx').on(table.email),
}));

// ============================================================================
// WELCOME MESSAGE INQUIRIES TABLE
// ============================================================================

export const welcomeInquiries = sqliteTable('welcome_inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  question: text('question').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
}, (table) => ({
  emailIdx: index('welcome_email_idx').on(table.email),
  createdAtIdx: index('welcome_created_at_idx').on(table.createdAt),
}));

// ============================================================================
// PROPERTY LISTINGS TABLES (Enhanced for your website)
// ============================================================================

export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(), // URL-friendly identifier
  type: text('type').notNull(), // Villa, Apartment, Townhouse, Penthouse
  photoUrl: text('photo_url').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  squareArea: real('square_area').notNull(), // in square feet to match current data
  location: text('location').notNull(),
  price: real('price').notNull(),
  currency: text('currency').notNull().default('AED'),
  
  // Enhanced fields to match your current Property interface
  pricePerSqFt: real('price_per_sq_ft'),
  yearBuilt: integer('year_built'),
  parkingSpaces: integer('parking_spaces').default(0),
  dldUrl: text('dld_url'),
  furnished: integer('furnished', { mode: 'boolean' }).default(false),
  petFriendly: integer('pet_friendly', { mode: 'boolean' }).default(false),
  
  // JSON fields for arrays
  features: text('features'), // JSON array of features
  amenities: text('amenities'), // JSON array of amenities  
  highlights: text('highlights'), // JSON array of highlights
  images: text('images'), // JSON array of image URLs
  
  // Coordinates for map functionality
  latitude: real('latitude'),
  longitude: real('longitude'),
  
  // Status and visibility
  status: text('status').notNull().default('For Sale'), // For Sale, For Rent, Sold
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  homeDisplay: integer('home_display', { mode: 'boolean' }).notNull().default(false), // Display on homepage
  
  // Analytics
  viewCount: integer('view_count').notNull().default(0),
  lastUpdated: text('last_updated').notNull(),
  
  // Agent information (could be normalized later)
  agentName: text('agent_name'),
  agentPhone: text('agent_phone'),
  agentEmail: text('agent_email'),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: uniqueIndex('property_slug_idx').on(table.slug),
  typeIdx: index('property_type_idx').on(table.type),
  locationIdx: index('property_location_idx').on(table.location),
  priceIdx: index('property_price_idx').on(table.price),
  statusIdx: index('property_status_idx').on(table.status),
  activeIdx: index('property_active_idx').on(table.isActive),
  featuredIdx: index('property_featured_idx').on(table.isFeatured),
}));

// Property translations for multilingual support
export const propertyTranslations = sqliteTable('property_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  language: text('language').notNull(), // 'en', 'ar', 'ru'
  title: text('title').notNull(), // e.g., "Luxury Villa in Dubai"
  description: text('description'),
  locationDisplayName: text('location_display_name'),
  featuresTranslated: text('features_translated'), // JSON array of translated features
  amenitiesTranslated: text('amenities_translated'), // JSON array of translated amenities
  highlightsTranslated: text('highlights_translated'), // JSON array of translated highlights
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  propertyLanguageIdx: uniqueIndex('property_translation_unique_idx').on(table.propertyId, table.language),
  languageIdx: index('property_translation_language_idx').on(table.language),
}));

// ============================================================================
// BLOG TABLES
// ============================================================================

export const blogs = sqliteTable('blogs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(), // blog category/type
  readingMinutes: integer('reading_minutes').notNull(),
  authorId: integer('author_id').references(() => admins.id),
  featuredImageUrl: text('featured_image_url'),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  slugIdx: uniqueIndex('blog_slug_idx').on(table.slug),
  typeIdx: index('blog_type_idx').on(table.type),
  publishedIdx: index('blog_published_idx').on(table.isPublished),
  publishedAtIdx: index('blog_published_at_idx').on(table.publishedAt),
}));

// Blog translations for multilingual support
export const blogTranslations = sqliteTable('blog_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blogId: integer('blog_id').notNull().references(() => blogs.id, { onDelete: 'cascade' }),
  language: text('language').notNull(), // 'en', 'ar', 'ru'
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'), // short description for blog cards
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  blogLanguageIdx: uniqueIndex('blog_translation_unique_idx').on(table.blogId, table.language),
  languageIdx: index('blog_translation_language_idx').on(table.language),
  titleIdx: index('blog_translation_title_idx').on(table.title),
}));

// ============================================================================
// PROPERTY EVALUATION REQUESTS TABLE
// ============================================================================

export const propertyEvaluations = sqliteTable('property_evaluations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Contact Information
  contactName: text('contact_name').notNull(),
  contactEmail: text('contact_email').notNull(),
  contactPhoneNumber: text('contact_phone_number').notNull(),
  
  // Property Details
  propertyType: text('property_type').notNull(), // apartment, villa, townhouse, penthouse
  propertyLocation: text('property_location').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  squareArea: real('square_area').notNull(),
  condition: text('condition').notNull(), // excellent, good, fair, needs_renovation
  yearBuilt: integer('year_built'),
  amenities: text('amenities'), // JSON array
  additionalDetails: text('additional_details'),
  
  // System fields
  status: text('status').notNull().default('pending'), // pending, in_review, completed
  evaluatedPrice: real('evaluated_price'), // estimated value set by admin
  evaluatorNotes: text('evaluator_notes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
}, (table) => ({
  emailIdx: index('evaluation_email_idx').on(table.contactEmail),
  statusIdx: index('evaluation_status_idx').on(table.status),
  createdAtIdx: index('evaluation_created_at_idx').on(table.createdAt),
  locationIdx: index('evaluation_location_idx').on(table.propertyLocation),
}));

// ============================================================================
// CONTACT US FORM TABLE
// ============================================================================

export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  email: text('email').notNull(),
  budgetRange: text('budget_range'), // e.g., "500k-1M AED"
  messageDetails: text('message_details').notNull(),
  preferredContactMethod: text('preferred_contact_method').default('email'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  isReplied: integer('is_replied', { mode: 'boolean' }).notNull().default(false),
  priority: text('priority').notNull().default('normal'), // low, normal, high
  source: text('source').default('contact_form'), // contact_form, phone, email, etc.
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  emailIdx: index('contact_email_idx').on(table.email),
  isReadIdx: index('contact_is_read_idx').on(table.isRead),
  createdAtIdx: index('contact_created_at_idx').on(table.createdAt),
  priorityIdx: index('contact_priority_idx').on(table.priority),
}));

// ============================================================================
// SYSTEM SETTINGS TABLE (for website configuration)
// ============================================================================

export const systemSettings = sqliteTable('system_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value'),
  description: text('description'),
  dataType: text('data_type').notNull().default('string'), // string, number, boolean, json
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  settingKeyIdx: uniqueIndex('system_setting_key_idx').on(table.settingKey),
}));

// ============================================================================
// AUDIT LOG TABLE (Security & Tracking)
// ============================================================================

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  adminId: integer('admin_id').references(() => admins.id),
  action: text('action').notNull(), // CREATE, UPDATE, DELETE, LOGIN, etc.
  tableName: text('table_name'),
  recordId: integer('record_id'),
  oldValues: text('old_values'), // JSON string of old values
  newValues: text('new_values'), // JSON string of new values
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  adminIdIdx: index('audit_admin_id_idx').on(table.adminId),
  actionIdx: index('audit_action_idx').on(table.action),
  tableIdx: index('audit_table_idx').on(table.tableName),
  createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
}));

// ============================================================================
// RELATIONS (for Drizzle ORM query building)
// ============================================================================

import { relations } from 'drizzle-orm';

export const propertiesRelations = relations(properties, ({ many }) => ({
  translations: many(propertyTranslations),
}));

export const propertyTranslationsRelations = relations(propertyTranslations, ({ one }) => ({
  property: one(properties, {
    fields: [propertyTranslations.propertyId],
    references: [properties.id],
  }),
}));

export const blogsRelations = relations(blogs, ({ many, one }) => ({
  translations: many(blogTranslations),
  author: one(admins, {
    fields: [blogs.authorId],
    references: [admins.id],
  }),
}));

export const blogTranslationsRelations = relations(blogTranslations, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogTranslations.blogId],
    references: [blogs.id],
  }),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  blogs: many(blogs),
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(admins, {
    fields: [auditLogs.adminId],
    references: [admins.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS for TypeScript
// ============================================================================

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyTranslation = typeof propertyTranslations.$inferSelect;
export type NewPropertyTranslation = typeof propertyTranslations.$inferInsert;
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type PropertyEvaluation = typeof propertyEvaluations.$inferSelect;
export type NewPropertyEvaluation = typeof propertyEvaluations.$inferInsert;
export type WelcomeInquiry = typeof welcomeInquiries.$inferSelect;
export type NewWelcomeInquiry = typeof welcomeInquiries.$inferInsert;