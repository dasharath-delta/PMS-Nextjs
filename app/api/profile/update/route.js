import { profiles } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { apiResponse } from "@/util/response";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { eq } from "drizzle-orm";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions); 
    
    if (!session?.user?.id) {
      return apiResponse({
        success: false,
        message: "Unauthorized",
        status: 401,
      }); 
    }

    const body = await req.json();
    const { firstname, lastname, bio, dob, phone, location } = body;

    const [updatedProfile] = await db
      .update(profiles)
      .set({
        firstname,
        lastname,
        bio: bio ?? null,
        dob: dob ?? null,
        phone: phone ?? null,
        location: location ?? null,
      })
      .where(eq(profiles.userId, Number(session.user.id))) // Only update current user
      .returning();

    return apiResponse({
      success: true,
      message: "Profile Updated",
      data: updatedProfile,
      status: 200,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return apiResponse({
      success: false,
      message: "Failed to update profile",
      errors: error.message,
      status: 500,
    });
  }
}
