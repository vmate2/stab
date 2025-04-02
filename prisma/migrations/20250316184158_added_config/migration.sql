-- AlterTable
ALTER TABLE "users" ADD COLUMN     "config" JSONB NOT NULL DEFAULT '{"lang": "hu", "theme": "dark", "notificationsound": true, "keepLoggedIn": true}';
