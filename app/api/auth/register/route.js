import { apiResponse } from '@/util/response';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/drizzle/schema';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return apiResponse({
        success: false,
        message: 'All fields are required.',
        status: 400,
      });
    }

    // checking existing Usre
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      return apiResponse({
        success: false,
        message: 'User already exists with same email',
        status: 400,
      });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    const { password: _, ...safeUser } = user[0];

    return apiResponse({
      message: 'User registered successfully',
      data: safeUser,
      status: 201,
    });
  } catch (err) {
    return apiResponse({
      success: false,
      message: 'Failed to register user',
      errors: err.message,
      status: 500,
    });
  }
}
