ALTER TABLE "organization_user_settings" RENAME COLUMN "id" TO "userId";--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_user_settings" DROP CONSTRAINT "organization_user_settings_id_organizationId_pk";--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_userId_organizationId_pk" PRIMARY KEY("userId","organizationId");--> statement-breakpoint
ALTER TABLE "organization_user_settings" ADD CONSTRAINT "organization_user_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;