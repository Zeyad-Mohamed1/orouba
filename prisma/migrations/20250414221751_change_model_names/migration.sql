/*
  Warnings:

  - You are about to drop the column `cook_id` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `Cook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CookCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dish_id` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cook" DROP CONSTRAINT "Cook_cookCategory_id_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_cook_id_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "cook_id",
ADD COLUMN     "dish_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Cook";

-- DropTable
DROP TABLE "CookCategory";

-- CreateTable
CREATE TABLE "DishCategory" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DishCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "dishCategory_id" INTEGER NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_dishCategory_id_fkey" FOREIGN KEY ("dishCategory_id") REFERENCES "DishCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
