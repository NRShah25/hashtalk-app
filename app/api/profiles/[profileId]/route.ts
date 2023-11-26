/**
 * @module route.ts
 * @description This module provides an API route handler for creating new servers.
 * @requires uuid
 * @requires next/server
 * @requires @prisma/client
 * @requires @/lib/current-profile
 * @requires @/lib/db
 */

import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { profileId } = req.query;

        const profile = await db.profile.findUnique({
            where: { id: profileId as string }
        });

        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error("[PROFILES_GET]", error);
        res.status(500).send('Internal Server Error');
    }
}