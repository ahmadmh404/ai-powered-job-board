ALTER TABLE "organaiztion_user_settigns" RENAME TO "organaiztion_user_settings";--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_organizationId_organaizatoins_id_fk";
--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" DROP CONSTRAINT "organaiztion_user_settigns_id_organizationId_pk";--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_id_organizationId_pk" PRIMARY KEY("id","organizationId");--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organaiztion_user_settings" ADD CONSTRAINT "organaiztion_user_settings_organizationId_organaizatoins_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organaizatoins"("id") ON DELETE no action ON UPDATE no action;