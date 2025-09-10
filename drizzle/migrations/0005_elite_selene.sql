ALTER TABLE "job_listings" RENAME COLUMN "organizationId" TO "description";--> statement-breakpoint
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_organizationId_organizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_description_organizatoins_id_fk" FOREIGN KEY ("description") REFERENCES "public"."organizatoins"("id") ON DELETE cascade ON UPDATE no action;