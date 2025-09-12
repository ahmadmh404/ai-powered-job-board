ALTER TABLE "job_listings" RENAME COLUMN "stateAbreviation" TO "stateAbbreviation";--> statement-breakpoint
DROP INDEX "job_listings_stateAbreviation_index";--> statement-breakpoint
CREATE INDEX "job_listings_stateAbbreviation_index" ON "job_listings" USING btree ("stateAbbreviation");