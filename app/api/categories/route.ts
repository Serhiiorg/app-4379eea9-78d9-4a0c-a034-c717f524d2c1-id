import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { Category } from "@/app/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    // Fetch all categories from the database
    const result = await pool.query("SELECT * FROM categories");

    // Map the rows to Category objects
    const categories = result.rows.map((row) => ({
      ...row.value,
      id: row.id,
    })) as Category[];

    // Create a map of categories by ID for easy lookup
    const categoryMap = new Map<string, Category & { children: Category[] }>();

    // Initialize each category with an empty children array
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build the parent-child relationships
    const rootCategories: (Category & { children: Category[] })[] = [];

    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parentId && categoryMap.has(category.parentId)) {
        // This is a child category, add it to its parent's children array
        const parent = categoryMap.get(category.parentId)!;
        parent.children.push(categoryWithChildren);
      } else {
        // This is a root category
        rootCategories.push(categoryWithChildren);
      }
    });

    return NextResponse.json({
      categories: categories,
      rootCategories: rootCategories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch categories: ${error}` },
      { status: 500 },
    );
  }
}
