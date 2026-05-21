import Fastify from "fastify";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = Fastify()

interface AuthRequest extends Fastify.FastifyRequest {
    user?: {
        username: string
        iat: number
        exp: number
    }
}

async function authenticateToken(req: AuthRequest, res: Fastify.FastifyReply): Promise<void> {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null) return res.status(401).send("Unauthorized")

    const secret = fs.readFileSync("./certs/public.pem")
    
    try {
        const user = jwt.verify(token, secret) as AuthRequest["user"]
        req.user = user
    } catch(err) {
        return res.status(403).send("Forbidden")
    }
}

app.get("/me", async(req: AuthRequest, res) => {
    await authenticateToken(req, res)
    if(res.statusCode >= 400) return
    if(!req.user) return res.status(401).send("Unauthorized")
    res.send({username: req.user.username})
})

const start = async () => {
    try {
        await app.listen({port:4000})
        console.log("Server Running on port 4000")
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

start()