import { getServerSession } from "next-auth";
import { apiResponse } from "@/util/response";
import { eq } from "drizzle-orm";
import { authOptions } from "../../[...nextauth]/route"; // path to your NextAuth config
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Fetch user from DB
        const [user] = await db.select().from(users).where(eq(users.email, session.user.email))

        if (!user) {
            return apiResponse({
                success: false,
                message: "User not found",
                status: 404
            })
        }
        const { password: _, ...safeUser } = user
        return apiResponse({
            success: true,
            message: "Authorized",
            data: safeUser,
            status: 200
        })
    } catch (err) {
        console.log("Unautorized error from Me", err);
        return apiResponse(
            { success: false, message: "Failed to fetch user", errors: err.message, status: 500 },

        );
    }
}
