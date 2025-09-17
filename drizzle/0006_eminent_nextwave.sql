ALTER TABLE "users" ALTER COLUMN "is_online" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "login_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_login" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_changed_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_changed_at" DROP DEFAULT;