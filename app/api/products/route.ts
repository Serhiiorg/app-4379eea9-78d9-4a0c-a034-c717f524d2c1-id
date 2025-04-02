import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Product, Gemstone, Material, ProductImage } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build the base query with filters
    let query = `SELECT * FROM products WHERE 1=1`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (categoryId) {
      query += ` AND value->>'categoryId' = $${paramIndex}`;
      queryParams.push(categoryId);
      paramIndex++;
    }

    if (featured) {
      query += ` AND value->>'featured' = $${paramIndex}`;
      queryParams.push(featured.toLowerCase() === "true" ? "true" : "false");
      paramIndex++;
    }

    if (minPrice) {
      query += ` AND (value->>'price')::numeric >= $${paramIndex}`;
      queryParams.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND (value->>'price')::numeric <= $${paramIndex}`;
      queryParams.push(maxPrice);
      paramIndex++;
    }

    // Execute the query
    const productsResult = await pool.query(query, queryParams);
    const products = productsResult.rows.map((row) => ({
      ...row.value,
      id: row.id,
    })) as Product[];

    // Prepare the response with additional data
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        // Get gemstones for this product
        let gemstones: Gemstone[] = [];
        if (product.gemstoneIds && product.gemstoneIds.length > 0) {
          const gemstoneQuery = `
          SELECT * FROM gemstones 
          WHERE id = ANY($1::uuid[])
        `;
          const gemstoneResult = await pool.query(gemstoneQuery, [
            product.gemstoneIds,
          ]);
          gemstones = gemstoneResult.rows.map((row) => ({
            ...row.value,
            id: row.id,
          }));
        }

        // Get materials for this product
        let materials: Material[] = [];
        if (product.materialIds && product.materialIds.length > 0) {
          const materialQuery = `
          SELECT * FROM materials 
          WHERE id = ANY($1::uuid[])
        `;
          const materialResult = await pool.query(materialQuery, [
            product.materialIds,
          ]);
          materials = materialResult.rows.map((row) => ({
            ...row.value,
            id: row.id,
          }));
        }

        // Get primary image for this product
        const imageQuery = `
        SELECT * FROM product_images 
        WHERE value->>'productId' = $1 AND value->>'isPrimary' = 'true'
        LIMIT 1
      `;
        const imageResult = await pool.query(imageQuery, [product.id]);
        let primaryImage: ProductImage | null = null;

        if (imageResult.rows.length > 0) {
          primaryImage = {
            ...imageResult.rows[0].value,
            id: imageResult.rows[0].id,
          } as ProductImage;
        }

        return {
          ...product,
          gemstones,
          materials,
          primaryImage,
        };
      }),
    );

    return NextResponse.json(productsWithDetails);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch products: ${error}` },
      { status: 500 },
    );
  }
}
