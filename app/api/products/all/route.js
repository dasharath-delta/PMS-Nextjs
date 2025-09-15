import { db } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { like } from 'drizzle-orm';
import { apiResponse } from '@/util/response';

export async function GET(req) {
  try {
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    let query = db.select().from(products);

    if (search) {
      query = query.where(
        like(products.name, `%${search}%`).or(
          like(products.category, `%${search}%`)
        )
      );
    }

    const allProducts = await query;

    if (!allProducts.length) {
      return apiResponse({
        success: true,
        message: 'No products found',
        data: [],
        status: 200,
      });
    }

    return apiResponse({
      success: true,
      message: 'Products fetched successfully',
      data: allProducts,
      status: 200,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return apiResponse({
      success: false,
      message: 'Failed to fetch products',
      errors: err.message,
      status: 500,
    });
  }
}
