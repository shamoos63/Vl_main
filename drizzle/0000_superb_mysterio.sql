CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_username_idx` ON `admins` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_email_idx` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_id` integer,
	`action` text NOT NULL,
	`table_name` text,
	`record_id` integer,
	`old_values` text,
	`new_values` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_admin_id_idx` ON `audit_logs` (`admin_id`);--> statement-breakpoint
CREATE INDEX `audit_action_idx` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `audit_table_idx` ON `audit_logs` (`table_name`);--> statement-breakpoint
CREATE INDEX `audit_created_at_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE TABLE `blog_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`blog_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`meta_title` text,
	`meta_description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_translation_unique_idx` ON `blog_translations` (`blog_id`,`language`);--> statement-breakpoint
CREATE INDEX `blog_translation_language_idx` ON `blog_translations` (`language`);--> statement-breakpoint
CREATE INDEX `blog_translation_title_idx` ON `blog_translations` (`title`);--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`reading_minutes` integer NOT NULL,
	`author_id` integer,
	`featured_image_url` text,
	`is_published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `blog_slug_idx` ON `blogs` (`slug`);--> statement-breakpoint
CREATE INDEX `blog_type_idx` ON `blogs` (`type`);--> statement-breakpoint
CREATE INDEX `blog_published_idx` ON `blogs` (`is_published`);--> statement-breakpoint
CREATE INDEX `blog_published_at_idx` ON `blogs` (`published_at`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone_number` text NOT NULL,
	`email` text NOT NULL,
	`budget_range` text,
	`message_details` text NOT NULL,
	`preferred_contact_method` text DEFAULT 'email',
	`is_read` integer DEFAULT false NOT NULL,
	`is_replied` integer DEFAULT false NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`source` text DEFAULT 'contact_form',
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `contact_email_idx` ON `contact_messages` (`email`);--> statement-breakpoint
CREATE INDEX `contact_is_read_idx` ON `contact_messages` (`is_read`);--> statement-breakpoint
CREATE INDEX `contact_created_at_idx` ON `contact_messages` (`created_at`);--> statement-breakpoint
CREATE INDEX `contact_priority_idx` ON `contact_messages` (`priority`);--> statement-breakpoint
CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`photo_url` text NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`square_area` real NOT NULL,
	`location` text NOT NULL,
	`price` real NOT NULL,
	`currency` text DEFAULT 'AED' NOT NULL,
	`price_per_sq_ft` real,
	`year_built` integer,
	`parking_spaces` integer DEFAULT 0,
	`furnished` integer DEFAULT false,
	`pet_friendly` integer DEFAULT false,
	`features` text,
	`amenities` text,
	`highlights` text,
	`images` text,
	`latitude` real,
	`longitude` real,
	`status` text DEFAULT 'For Sale' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`last_updated` text NOT NULL,
	`agent_name` text,
	`agent_phone` text,
	`agent_email` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_slug_unique` ON `properties` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `property_slug_idx` ON `properties` (`slug`);--> statement-breakpoint
CREATE INDEX `property_type_idx` ON `properties` (`type`);--> statement-breakpoint
CREATE INDEX `property_location_idx` ON `properties` (`location`);--> statement-breakpoint
CREATE INDEX `property_price_idx` ON `properties` (`price`);--> statement-breakpoint
CREATE INDEX `property_status_idx` ON `properties` (`status`);--> statement-breakpoint
CREATE INDEX `property_active_idx` ON `properties` (`is_active`);--> statement-breakpoint
CREATE INDEX `property_featured_idx` ON `properties` (`is_featured`);--> statement-breakpoint
CREATE TABLE `property_evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_name` text NOT NULL,
	`contact_email` text NOT NULL,
	`contact_phone_number` text NOT NULL,
	`property_type` text NOT NULL,
	`property_location` text NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`square_area` real NOT NULL,
	`condition` text NOT NULL,
	`year_built` integer,
	`amenities` text,
	`additional_details` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`evaluated_price` real,
	`evaluator_notes` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer
);
--> statement-breakpoint
CREATE INDEX `evaluation_email_idx` ON `property_evaluations` (`contact_email`);--> statement-breakpoint
CREATE INDEX `evaluation_status_idx` ON `property_evaluations` (`status`);--> statement-breakpoint
CREATE INDEX `evaluation_created_at_idx` ON `property_evaluations` (`created_at`);--> statement-breakpoint
CREATE INDEX `evaluation_location_idx` ON `property_evaluations` (`property_location`);--> statement-breakpoint
CREATE TABLE `property_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`language` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`location_display_name` text,
	`features_translated` text,
	`amenities_translated` text,
	`highlights_translated` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `property_translation_unique_idx` ON `property_translations` (`property_id`,`language`);--> statement-breakpoint
CREATE INDEX `property_translation_language_idx` ON `property_translations` (`language`);--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setting_key` text NOT NULL,
	`setting_value` text,
	`description` text,
	`data_type` text DEFAULT 'string' NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `system_settings_setting_key_unique` ON `system_settings` (`setting_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `system_setting_key_idx` ON `system_settings` (`setting_key`);--> statement-breakpoint
CREATE TABLE `welcome_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone_number` text NOT NULL,
	`question` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`is_read` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX `welcome_email_idx` ON `welcome_inquiries` (`email`);--> statement-breakpoint
CREATE INDEX `welcome_created_at_idx` ON `welcome_inquiries` (`created_at`);