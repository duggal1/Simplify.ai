"use server";

import { db } from "@/utils/dbConfig"
import { currentUser } from "@clerk/nextjs/server";
import { users } from "@/utils/schema";
import { eq } from "drizzle-orm";

const getAuthStatus = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return { error: "No authenticated user found" };
        }

        if (!user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return { error: "Incomplete user profile" };
        }

        const email = user.emailAddresses[0].emailAddress;

        try {
            const existingUser = await db.select()
                .from(users)
                .where(eq(users.id, user.id))
                .execute();

            if (!existingUser.length) {
                // Create new user
                await db.insert(users).values({
                    id: user.id, // Using Clerk ID as primary key
                    email: email,
                    name: user.firstName || user.username || 'User',
                    profileImage: user.imageUrl || '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    points: 50, // Default value
                    credits: 30, // Default value
                    subscription: false // Default value
                });
            } else {
                // Update existing user
                await db.update(users)
                    .set({
                        email: email,
                        name: user.firstName || user.username || existingUser[0].name,
                        profileImage: user.imageUrl || existingUser[0].profileImage,
                        updatedAt: new Date(),
                    })
                    .where(eq(users.id, user.id));
            }

            return { success: true };
        } catch (dbError) {
            console.error("Database error:", dbError);
            return { error: "Failed to update user profile🥲" };
        }
    } catch (error) {
        console.error("Auth status error:", error);
        return { 
            error: error instanceof Error 
                ? error.message 
                : "Authentication verification failed" 
        };
    }
};

export default getAuthStatus;
