import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { apiResponse } from "@/util/response";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return apiResponse({
        success: false,
        message: "Unauthorized",
        status: 401,
      });
    }

    const formData = await req.formData();
    const avatarFile = formData.get("avatar");

    if (!avatarFile) {
      return apiResponse({
        success: false,
        message: "No file uploaded",
        status: 400,
      });
    }

    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinaryResponse = await uploadBufferToCloudinary(
      buffer,
      "avatars"
    );

    // Try update first
    const [updatedProfile] = await db
      .update(profiles)
      .set({ avatar: cloudinaryResponse.secure_url })
      .where(eq(profiles.userId, Number(session.user.id)))
      .returning();

    let finalProfile = updatedProfile;

    // If profile does not exist → create it
    if (!updatedProfile) {
      const [newProfile] = await db
        .insert(profiles)
        .values({
          userId: Number(session.user.id),
          avatar: cloudinaryResponse.secure_url,
        })
        .returning();
      finalProfile = newProfile;
    }

    return apiResponse({
      success: true,
      message: "Avatar uploaded successfully",
      data: finalProfile,
      status: 201,
    });
  } catch (err) {
    console.error("Avatar Upload Error:", err);
    return apiResponse({
      success: false,
      message: "Failed to upload avatar",
      errors: err.message,
      status: 500,
    });
  }
}
