import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { CartItem, Product, ProductImage } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Get cart items for the user
    const cartItemsQuery = `
      SELECT * FROM cart_items 
      WHERE value->>'userId' = $1
    `;
    const cartItemsResult = await pool.query(cartItemsQuery, [userId]);

    const cartItems = cartItemsResult.rows.map((row) => ({
      ...row.value,
      id: row.id,
    })) as CartItem[];

    // Get detailed information for each cart item
    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        // Get product details
        const productQuery = `
        SELECT * FROM products 
        WHERE id = $1
      `;
        const productResult = await pool.query(productQuery, [item.productId]);
        let product: Product | null = null;

        if (productResult.rows.length > 0) {
          product = {
            ...productResult.rows[0].value,
            id: productResult.rows[0].id,
          } as Product;
        }

        // Get primary image for the product
        const imageQuery = `
        SELECT * FROM product_images 
        WHERE value->>'productId' = $1 AND value->>'isPrimary' = 'true'
        LIMIT 1
      `;
        const imageResult = await pool.query(imageQuery, [item.productId]);
        let primaryImage: ProductImage | null = null;

        if (imageResult.rows.length > 0) {
          primaryImage = {
            ...imageResult.rows[0].value,
            id: imageResult.rows[0].id,
          } as ProductImage;
        }

        return {
          ...item,
          product,
          primaryImage,
        };
      }),
    );

    return NextResponse.json(cartItemsWithDetails);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch cart items: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    // Validate required fields
    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { error: "userId, productId, and quantity are required" },
        { status: 400 },
      );
    }

    // Check if product exists
    const productQuery = `SELECT * FROM products WHERE id = $1`;
    const productResult = await pool.query(productQuery, [productId]);

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if item already exists in cart
    const existingItemQuery = `
      SELECT * FROM cart_items 
      WHERE value->>'userId' = $1 AND value->>'productId' = $2
    `;
    const existingItemResult = await pool.query(existingItemQuery, [
      userId,
      productId,
    ]);

    if (existingItemResult.rows.length > 0) {
      // Item already exists, update quantity instead
      const existingItem = existingItemResult.rows[0];
      const currentQuantity = parseInt(existingItem.value.quantity);
      const newQuantity = currentQuantity + parseInt(quantity);

      const updateQuery = `
        UPDATE cart_items 
        SET value = jsonb_set(value, '{quantity}', $1) 
        WHERE id = $2
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [
        JSON.stringify(newQuantity),
        existingItem.id,
      ]);

      return NextResponse.json({
        ...updateResult.rows[0].value,
        id: updateResult.rows[0].id,
        message: "Cart item quantity updated",
      });
    }

    // Create new cart item
    const newCartItem: Omit<CartItem, "id"> = {
      userId,
      productId,
      quantity: parseInt(quantity),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertQuery = `
      INSERT INTO cart_items (value) 
      VALUES ($1) 
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [
      JSON.stringify(newCartItem),
    ]);

    return NextResponse.json(
      {
        ...insertResult.rows[0].value,
        id: insertResult.rows[0].id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to add item to cart: ${error}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    // Validate required fields
    if (!id || !quantity) {
      return NextResponse.json(
        { error: "Cart item ID and quantity are required" },
        { status: 400 },
      );
    }

    // Check if cart item exists
    const existingItemQuery = `SELECT * FROM cart_items WHERE id = $1`;
    const existingItemResult = await pool.query(existingItemQuery, [id]);

    if (existingItemResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 },
      );
    }

    // Update cart item quantity
    const updateQuery = `
      UPDATE cart_items 
      SET value = jsonb_set(
        jsonb_set(value, '{quantity}', $1),
        '{updatedAt}', $2
      )
      WHERE id = $3
      RETURNING *
    `;

    const updatedAt = JSON.stringify(new Date());
    const updateResult = await pool.query(updateQuery, [
      JSON.stringify(parseInt(quantity)),
      updatedAt,
      id,
    ]);

    return NextResponse.json({
      ...updateResult.rows[0].value,
      id: updateResult.rows[0].id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update cart item: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 },
      );
    }

    // Check if cart item exists
    const existingItemQuery = `SELECT * FROM cart_items WHERE id = $1`;
    const existingItemResult = await pool.query(existingItemQuery, [id]);

    if (existingItemResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 },
      );
    }

    // Delete cart item
    const deleteQuery = `DELETE FROM cart_items WHERE id = $1 RETURNING *`;
    const deleteResult = await pool.query(deleteQuery, [id]);

    return NextResponse.json({
      message: "Cart item removed successfully",
      deletedItem: {
        ...deleteResult.rows[0].value,
        id: deleteResult.rows[0].id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to remove cart item: ${error}` },
      { status: 500 },
    );
  }
}
