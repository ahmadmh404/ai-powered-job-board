ALTER TABLE "organaizatoins" RENAME TO "organizatoins";--> statement-breakpoint
ALTER TABLE "job_listings" DROP CONSTRAINT "job_listings_organaizationId_organaizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settings_organaizationId_organaizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_organaizationId_organizatoins_id_fk" FOREIGN KEY ("organaizationId") REFERENCES "public"."organizatoins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_organaizationId_organizatoins_id_fk" FOREIGN KEY ("organaizationId") REFERENCES "public"."organizatoins"("id") ON DELETE no action ON UPDATE no action;