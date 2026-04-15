import { Router, type IRouter } from "express";
import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, productsTable, categoriesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable);

  const [orderCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable);

  const [revenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(total_amount::numeric), 0)::float` })
    .from(ordersTable);

  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const categoryBreakdown = await db
    .select({
      categoryName: categoriesTable.name,
      count: sql<number>`count(*)::int`,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.name);

  res.json({
    totalProducts: productCount.count,
    totalOrders: orderCount.count,
    totalRevenue: revenueResult.total,
    pendingOrders: pendingCount.count,
    categoryBreakdown,
  });
});

router.get("/dashboard/recent-orders", async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(10);

  const result = await Promise.all(
    orders.map(async (o) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, o.id));
      return {
        id: o.id,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerAddress: o.customerAddress,
        pincode: o.pincode,
        paymentMethod: o.paymentMethod,
        status: o.status,
        totalAmount: Number(o.totalAmount),
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: Number(item.price),
          customText: item.customText,
          customImageUrl: item.customImageUrl,
          size: item.size,
        })),
        createdAt: o.createdAt?.toISOString(),
      };
    })
  );

  res.json(result);
});

export default router;
