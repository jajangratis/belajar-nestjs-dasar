-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" VARCHAR(100),
ALTER COLUMN "last_name" DROP NOT NULL;
