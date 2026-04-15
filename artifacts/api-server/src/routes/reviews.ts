import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "@workspace/db";
import {
  ListReviewsQueryParams,
  CreateReviewBody,
} from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const query = ListReviewsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.productId) {
    conditions.push(eq(reviewsTable.productId, query.data.productId));
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(reviewsTable.createdAt));

  res.json(
    reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      customerName: r.customerName,
      rating: r.rating,
      comment: r.comment,
      photoUrl: r.photoUrl,
      createdAt: r.createdAt?.toISOString(),
    }))
  );
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db.insert(reviewsTable).values({
    productId: parsed.data.productId,
    customerName: parsed.data.customerName,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    photoUrl: parsed.data.photoUrl,
  }).returning();

  await db
    .update(productsTable)
    .set({
      reviewCount: sql`${productsTable.reviewCount} + 1`,
      rating: sql`(
        SELECT ROUND(AVG(rating)::numeric, 2)
        FROM reviews
        WHERE product_id = ${parsed.data.productId}
      )`,
    })
    .where(eq(productsTable.id, parsed.data.productId));

  res.status(201).json({
    id: review.id,
    productId: review.productId,
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    photoUrl: review.photoUrl,
    createdAt: review.createdAt?.toISOString(),
  });
});

export default router;
