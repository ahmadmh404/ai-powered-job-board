ALTER TABLE "job_listings" RENAME COLUMN "descriptoin" TO "organizationId";--> statement-breakpoint
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_description_organizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "experienceLevel" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."job_listing_experience_level";--> statement-breakpoint
CREATE TYPE "public"."job_listing_experience_level" AS ENUM('junior', 'mid-level', 'senior');--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "experienceLevel" SET DATA TYPE "public"."job_listing_experience_level" USING "experienceLevel"::"public"."job_listing_experience_level";--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_organizationId_organizatoins_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizatoins"("id") ON DELETE cascade ON UPDATE no action;