/*
  Warnings:

  - Added the required column `cook_id` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_product_id_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cook_id" INTEGER NOT NULL,
ALTER COLUMN "product_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT '';

-- CreateTable
CREATE TABLE "CookCategory" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cook" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cookCategory_id" INTEGER NOT NULL,

    CONSTRAINT "Cook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cook_id_fkey" FOREIGN KEY ("cook_id") REFERENCES "Cook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cook" ADD CONSTRAINT "Cook_cookCategory_id_fkey" FOREIGN KEY ("cookCategory_id") REFERENCES "CookCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
