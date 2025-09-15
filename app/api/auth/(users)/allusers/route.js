import { users } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { apiResponse } from '@/util/response';

export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    if (!allUsers || allUsers.length === 0) {
      return apiResponse({
        success: false,
        message: 'No users found',
        status: 404,
      });
    }

    // Remove password field from each user
    const safeUsers = allUsers.map(({ password, ...rest }) => rest);

    return apiResponse({
      success: true,
      message: 'Users fetched successfully',
      data: safeUsers,
      status: 200,
    });
  } catch (err) {
    console.error('Unauthorized error:', err);
    return apiResponse({
      success: false,
      message: 'Failed to fetch users',
      errors: err.message,
      status: 500,
    });
  }
}
