ALTER TABLE "users" ADD COLUMN "is_online" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_seen" date DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "login_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" date DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_changed_at" date DEFAULT null;