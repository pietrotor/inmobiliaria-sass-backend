ALTER TABLE "organization" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "logo" varchar(1000);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "website" varchar(500);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "whatsapp" varchar(50);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "instagram" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "facebook" varchar(255);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "primary_color" varchar(7);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "secondary_color" varchar(7);--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "timezone" varchar(100) DEFAULT 'America/Caracas';--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "default_currency" varchar(10) DEFAULT 'USD';--> statement-breakpoint
CREATE UNIQUE INDEX "organization_slug_idx" ON "organization" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_email_idx" ON "organization" USING btree ("email");