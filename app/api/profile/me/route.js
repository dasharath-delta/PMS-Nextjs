import { db } from "@/lib/db";
import { profiles } from "@/drizzle/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; 
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, Number(session.user.id)));

    return Response.json({
      success: true,
      data: profile.length > 0 ? profile[0] : null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
