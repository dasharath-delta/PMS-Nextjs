import { users } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { apiResponse } from '@/util/response';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import { eq } from 'drizzle-orm';

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiResponse({
        success: false,
        message: 'Unauthorized',
        status: 401,
      });
    }

    const { username } = await req.json();

    if (!username) {
      apiResponse({
        success: false,
        message: 'Please provide username to be updated.',
        status: 401,
      });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ username })
      .where(eq(users.id, Number(session.user.id)))
      .returning();

    const { password: _, ...safeUser } = updatedUser;

    return apiResponse({
      success: true,
      message: 'Username updated successfully.',
      data: safeUser,
      status: 200,
    });
  } catch (error) {
    console.log('Username Update Error:', error);
    return apiResponse({
      success: false,
      message: 'Failed to update username',
      errors: error.message,
      status: 500,
    });
  }
}
