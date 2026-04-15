import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, ordersTable, orderItemsTable } from "@workspace/db";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrderWithItems(orderId: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;

  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));

  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    pincode: order.pincode,
    paymentMethod: order.paymentMethod,
    status: order.status,
    totalAmount: Number(order.totalAmount),
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
    createdAt: order.createdAt?.toISOString(),
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const query = ListOrdersQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.status) {
    conditions.push(eq(ordersTable.status, query.data.status));
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(ordersTable.createdAt));

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

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const totalAmount = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [order] = await db.insert(ordersTable).values({
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerAddress: parsed.data.customerAddress,
    pincode: parsed.data.pincode,
    paymentMethod: parsed.data.paymentMethod,
    totalAmount: String(totalAmount),
    status: "pending",
  }).returning();

  await db.insert(orderItemsTable).values(
    parsed.data.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: (item as any).productName || `Product ${item.productId}`,
      quantity: item.quantity,
      price: String(item.price),
      customText: item.customText,
      customImageUrl: item.customImageUrl,
      size: item.size,
    }))
  );

  const full = await getOrderWithItems(order.id);
  res.status(201).json(full);
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const order = await getOrderWithItems(params.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(order);
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const order = await getOrderWithItems(params.data.id);
  res.json(order);
});

export default router;
