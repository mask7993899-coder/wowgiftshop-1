import { Router, type IRouter } from "express";
import { eq, ilike, and, desc } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatProduct(p: any, cat?: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    imageUrl: p.imageUrl,
    images: p.images || [],
    categoryId: p.categoryId,
    category: cat ? { id: cat.id, name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description } : undefined,
    featured: p.featured,
    customizable: p.customizable,
    rating: p.rating ? Number(p.rating) : 0,
    reviewCount: p.reviewCount || 0,
    sizes: p.sizes || [],
    inStock: p.inStock,
    createdAt: p.createdAt?.toISOString(),
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const query = ListProductsQueryParams.safeParse(req.query);
  const conditions = [];

  if (query.success && query.data.categoryId) {
    conditions.push(eq(productsTable.categoryId, query.data.categoryId));
  }
  if (query.success && query.data.search) {
    conditions.push(ilike(productsTable.name, `%${query.data.search}%`));
  }
  if (query.success && query.data.featured) {
    conditions.push(eq(productsTable.featured, true));
  }

  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(productsTable.createdAt));

  const products = rows.map((r) => formatProduct(r.products, r.categories));
  res.json(products);
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.featured, true))
    .orderBy(desc(productsTable.createdAt));

  const products = rows.map((r) => formatProduct(r.products, r.categories));
  res.json(products);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(formatProduct(rows[0].products, rows[0].categories));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    name: parsed.data.name,
    description: parsed.data.description,
    price: String(parsed.data.price),
    originalPrice: parsed.data.originalPrice ? String(parsed.data.originalPrice) : null,
    imageUrl: parsed.data.imageUrl,
    images: parsed.data.images || [],
    categoryId: parsed.data.categoryId,
    featured: parsed.data.featured || false,
    customizable: parsed.data.customizable ?? true,
    sizes: parsed.data.sizes || [],
  }).returning();

  res.status(201).json(formatProduct(product));
});

router.put("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db.update(productsTable).set({
    name: parsed.data.name,
    description: parsed.data.description,
    price: String(parsed.data.price),
    originalPrice: parsed.data.originalPrice ? String(parsed.data.originalPrice) : null,
    imageUrl: parsed.data.imageUrl,
    images: parsed.data.images || [],
    categoryId: parsed.data.categoryId,
    featured: parsed.data.featured || false,
    customizable: parsed.data.customizable ?? true,
    sizes: parsed.data.sizes || [],
  }).where(eq(productsTable.id, params.data.id)).returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(formatProduct(product));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db.delete(productsTable).where(eq(productsTable.id, params.data.id)).returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/categories/:id/products", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid category ID" });
    return;
  }

  const rows = await db
    .select()
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.categoryId, id))
    .orderBy(desc(productsTable.createdAt));

  const products = rows.map((r) => formatProduct(r.products, r.categories));
  res.json(products);
});

export default router;
