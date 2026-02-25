CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."project_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('PROJECT', 'UNIT', 'DEVELOPER', 'USER');--> statement-breakpoint
CREATE TYPE "public"."media_role" AS ENUM('COVER', 'GALLERY', 'BROCHURE', 'FLOOR_PLAN', 'LOGO', 'AVATAR');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('IMAGE', 'VIDEO', 'DOCUMENT');--> statement-breakpoint
CREATE TABLE "developer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"legal_name" varchar(255) NOT NULL,
	"tax_id" varchar(50) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"developer_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"address" varchar(500) NOT NULL,
	"country_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"neighborhood_id" uuid NOT NULL,
	"status" "project_status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "project_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"delivery_date" timestamp,
	"total_floors" integer,
	"total_units" integer DEFAULT 0 NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"default_commission_pct" real DEFAULT 2.5 NOT NULL,
	"intent_deadline_hours" integer DEFAULT 48 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"media_type" "media_type" NOT NULL,
	"role" "media_role" NOT NULL,
	"url" varchar(1000) NOT NULL,
	"key" varchar(1000) NOT NULL,
	"filename" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "property" CASCADE;--> statement-breakpoint
DROP TABLE "property_image" CASCADE;--> statement-breakpoint
DROP TABLE "property_price" CASCADE;--> statement-breakpoint
ALTER TABLE "developer" ADD CONSTRAINT "developer_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_developer_id_developer_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_neighborhood_id_neighborhood_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhood"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "developer_organization_id_idx" ON "developer" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "developer_tax_id_idx" ON "developer" USING btree ("tax_id");--> statement-breakpoint
CREATE INDEX "idx_media_entity" ON "media" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_media_entity_role" ON "media" USING btree ("entity_type","entity_id","role");--> statement-breakpoint
DROP TYPE "public"."currency";--> statement-breakpoint
DROP TYPE "public"."property_condition";--> statement-breakpoint
DROP TYPE "public"."property_status";--> statement-breakpoint
DROP TYPE "public"."property_type";--> statement-breakpoint
DROP TYPE "public"."transaction_type";