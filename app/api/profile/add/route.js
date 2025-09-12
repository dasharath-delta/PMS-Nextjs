import { profiles } from '@/drizzle/schema';
import { db } from '@/lib/db';
import { apiResponse } from '@/util/response';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiResponse({
        success: false,
        message: 'Unauthorized',
        status: 400,
      });
    }

    const body = await req.json();
    const { firstname, lastname, bio, dob, phone, location } = body;

    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId: Number(session.user.id), // ensure it's number
        firstname,
        lastname,
        bio: bio ?? null,
        dob: dob ?? null,
        phone: phone ?? null,
        location: location ?? null,
      })
      .returning();

    return apiResponse({
      success: true,
      message: 'Profile Updated',
      data: newProfile,
      status: 201,
    });
  } catch (error) {
    console.error('Profile Error:', error);
    return apiResponse({
      success: false,
      message: 'Failed to create profile',
      errors: error.message,
      status: 500,
    });
  }
}
