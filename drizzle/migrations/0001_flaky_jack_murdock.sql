ALTER TABLE "organaiztion_user_settigns" RENAME TO "organaiztion_user_settings";--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_organaizationId_organaizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_id_organaizationId_pk";--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_id_organaizationId_pk" PRIMARY KEY("id","organaizationId");--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_organaizationId_organaizatoins_id_fk" FOREIGN KEY ("organaizationId") REFERENCES "public"."organaizatoins"("id") ON DELETE no action ON UPDATE no action;