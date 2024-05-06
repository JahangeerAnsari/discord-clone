import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";

// check the current user profile and if it exists return profile information
export const currentProfilePages = async (req:NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  return profile;
};
