import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

/**
 * Retrieves the profile of the currently authenticated user.
 * @returns {Promise<Object|null>} The user's profile or null if not authenticated or in case of an error.
 */
export const currentProfile = async () => {
  try {
    const { userId } = auth();

    // If no user is authenticated, return null immediately.
    if (!userId) {
      console.log("No authenticated user found.");
      return null;
    }

    // Fetch the user profile from the database.
    const profile = await fetchUserProfile(userId);

    return profile;
  } catch (error) {
    // Log and handle errors gracefully.
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Fetches user profile from the database.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Object|null>} The user's profile or null if not found.
 */
async function fetchUserProfile(userId: string) {
  try {
    const profile = await db.profile.findUnique({
      where: { userId }
    });

    return profile;
  } catch (error) {
    // Log database errors and return null.
    console.error("Database error:", error);
    return null;
  }
}
