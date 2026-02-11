CREATE TYPE "public"."currency" AS ENUM('USD', 'VES', 'ARS', 'EUR', 'BRL', 'CLP', 'COP', 'MXN', 'PEN', 'UYU');--> statement-breakpoint
CREATE TYPE "public"."property_condition" AS ENUM('NEW', 'USED', 'UNDER_CONSTRUCTION', 'REMODELED', 'TO_REMODEL');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'SOLD', 'RENTED', 'RESERVED', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'GARAGE', 'BUILDING', 'COUNTRY_HOUSE', 'FARM', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'TRIPLEX', 'LOFT', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('SALE', 'RENT', 'TEMPORARY_RENT');--> statement-breakpoint
CREATE TABLE "city" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"country_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "country_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "neighborhood" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"city_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(600) NOT NULL,
	"property_type" "property_type" NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"status" "property_status" DEFAULT 'DRAFT' NOT NULL,
	"internal_code" varchar(100),
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"previous_price" numeric(15, 2),
	"maintenance_fee" numeric(12, 2),
	"price_per_sqm" numeric(12, 2),
	"description" text,
	"short_description" varchar(1000),
	"private_notes" text,
	"country_id" uuid,
	"city_id" uuid,
	"neighborhood_id" uuid,
	"address" varchar(500),
	"street_number" varchar(20),
	"floor" varchar(10),
	"apartment" varchar(20),
	"zip_code" varchar(20),
	"latitude" double precision,
	"longitude" double precision,
	"total_area" numeric(10, 2),
	"covered_area" numeric(10, 2),
	"land_area" numeric(10, 2),
	"bedrooms" integer,
	"bathrooms" integer,
	"half_bathrooms" integer,
	"garages" integer,
	"parking_spaces" integer,
	"stories" integer,
	"year_built" integer,
	"condition" "property_condition",
	"orientation" varchar(50),
	"disposition" varchar(50),
	"has_pool" boolean DEFAULT false,
	"has_garden" boolean DEFAULT false,
	"has_terrace" boolean DEFAULT false,
	"has_balcony" boolean DEFAULT false,
	"has_air_conditioning" boolean DEFAULT false,
	"has_heating" boolean DEFAULT false,
	"has_central_heating" boolean DEFAULT false,
	"has_fireplace" boolean DEFAULT false,
	"has_closets" boolean DEFAULT false,
	"has_laundry_room" boolean DEFAULT false,
	"has_security" boolean DEFAULT false,
	"has_elevator" boolean DEFAULT false,
	"has_gym" boolean DEFAULT false,
	"has_pets_allowed" boolean DEFAULT false,
	"is_furnished" boolean DEFAULT false,
	"has_rooftop" boolean DEFAULT false,
	"has_grill" boolean DEFAULT false,
	"has_solar_panels" boolean DEFAULT false,
	"has_water_tank" boolean DEFAULT false,
	"has_service_room" boolean DEFAULT false,
	"meta_title" varchar(200),
	"meta_description" varchar(500),
	"keywords" text[],
	"video_url" varchar(500),
	"virtual_tour_url" varchar(500),
	"agent_id" uuid,
	"contact_phone" varchar(50),
	"contact_email" varchar(255),
	"contact_whatsapp" varchar(50),
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"expires_at" timestamp,
	"view_count" integer DEFAULT 0 NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "property_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" varchar(1000) NOT NULL,
	"alt_text" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_price" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"currency" "currency" NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"is_main" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_property_price_currency" UNIQUE("property_id","currency")
);
--> statement-breakpoint
ALTER TABLE "city" ADD CONSTRAINT "city_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neighborhood" ADD CONSTRAINT "neighborhood_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_city_id_city_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."city"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_neighborhood_id_neighborhood_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."neighborhood"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_image" ADD CONSTRAINT "property_image_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_price" ADD CONSTRAINT "property_price_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_city_country" ON "city" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "idx_neighborhood_city" ON "neighborhood" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "idx_property_organization" ON "property" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_property_status_published_deleted" ON "property" USING btree ("status","is_published","deleted");--> statement-breakpoint
CREATE INDEX "idx_property_type" ON "property" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "idx_property_transaction" ON "property" USING btree ("transaction_type");--> statement-breakpoint
CREATE INDEX "idx_property_country" ON "property" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "idx_property_city" ON "property" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "idx_property_neighborhood" ON "property" USING btree ("neighborhood_id");--> statement-breakpoint
CREATE INDEX "idx_property_price" ON "property" USING btree ("price");--> statement-breakpoint
CREATE INDEX "idx_property_featured" ON "property" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "idx_property_agent" ON "property" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_property_image_property" ON "property_image" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "idx_property_price_property" ON "property_price" USING btree ("property_id");