-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PICKED_UP', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'PICKUP');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'FIXED', 'FREE_DELIVERY');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "menu_items" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "rating" DECIMAL(2,1) NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "spicy" INTEGER NOT NULL DEFAULT 0,
    "vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "vegan" BOOLEAN NOT NULL DEFAULT false,
    "glutenFree" BOOLEAN NOT NULL DEFAULT false,
    "prepTime" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "customizable" BOOLEAN NOT NULL DEFAULT false,
    "serves" INTEGER NOT NULL DEFAULT 1,
    "ingredients" TEXT[],
    "allergens" TEXT[],
    "nutrition" JSONB NOT NULL,
    "pairings" INTEGER[],
    "reviews" JSONB NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toppings" (
    "id" SERIAL NOT NULL,
    "toppingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toppings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "orderType" "OrderType" NOT NULL,
    "customerFirstName" TEXT NOT NULL,
    "customerLastName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "deliveryStreet" TEXT,
    "deliveryApartment" TEXT,
    "deliveryCity" TEXT,
    "deliveryPostalCode" TEXT,
    "deliveryInstructions" TEXT,
    "deliveryTimeType" TEXT NOT NULL,
    "scheduledDate" TEXT,
    "scheduledTime" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "promoCode" TEXT,
    "estimatedTime" INTEGER,
    "actualDeliveryTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "toppings" JSONB,
    "brothRichness" TEXT,
    "noodleFirmness" TEXT,
    "spiceLevel" INTEGER,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "minOrder" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_zones" (
    "id" SERIAL NOT NULL,
    "postalCode" TEXT NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "minOrder" DECIMAL(10,2),
    "estimatedTime" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'STAFF',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_slug_key" ON "menu_items"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "toppings_toppingId_key" ON "toppings"("toppingId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_zones_postalCode_key" ON "delivery_zones"("postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
