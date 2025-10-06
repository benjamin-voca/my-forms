CREATE TYPE "public"."form_user_role" AS ENUM('admin', 'participant');--> statement-breakpoint
CREATE TABLE "form_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"role" "form_user_role" NOT NULL,
	CONSTRAINT "form_users_form_id_user_id_role_unique" UNIQUE("form_id","user_id","role")
);
--> statement-breakpoint
ALTER TABLE "form_users" ADD CONSTRAINT "form_users_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_users" ADD CONSTRAINT "form_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;