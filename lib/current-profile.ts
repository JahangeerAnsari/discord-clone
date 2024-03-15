import { auth } from "@clerk/nextjs";
import { db } from "./db";

// check the current user profile and if it exists return profile information
export const currentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  return profile;
};
