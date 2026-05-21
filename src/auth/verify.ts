import jwt from "jsonwebtoken";
import { AuthRequest } from "./types.js";
import fs from "fs";
import Fastify from "fastify";

export async function authenticateToken(req: AuthRequest, res: Fastify.FastifyReply): Promise<void> {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null) return res.status(401).send("Unauthorized")

    const secret = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string)
    
    try {
        const user = jwt.verify(token, secret) as AuthRequest["user"]
        req.user = user
    } catch(err) {
        return res.status(403).send("Forbidden")
    }
}